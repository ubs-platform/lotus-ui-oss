import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  viewChild,
  ViewChild,
  input,
  model,
  signal
} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FileService } from '../../services/images.service';

@Component({
  selector: 'kasa-application-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
  standalone: false,
})
export class ImageUploadComponent {
  selectedFile = signal<File | null>(null);
  selectedFileReview = signal<string | ArrayBuffer | null>(null);
  imageUploaderBtn = viewChild<ElementRef>('imageUploader');
  readonly name = input<string>();
  // @Input() endpointUrl!: string;
  readonly category = input.required<string>();
  readonly objectId = input<string>();
  @Output() imageUrlAlreadyChange = new EventEmitter<string>();

  @Output() reviewImageChange = new EventEmitter<string | ArrayBuffer>();
  readonly imageUrlAlready = model<string | null>();

  constructor(private imageService: FileService) {}

  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    this.selectedFile.set(file);
    if (file) {
      const fr = new FileReader();
      fr.onload = () => {
        this.selectedFileReview.set(fr.result!);
        this.reviewImageChange.emit(this.selectedFileReview() as any);
      };
      fr.readAsDataURL(file);
    }
  }

  uploadImageOrContinue<T = any>(
    value?: T
  ): Observable<{ val: T; imageUrl: string }> {
    // return throwError(() => "Not imple");
    return new Observable((subscriber) => {
      const file = this.selectedFile();
      if (file) {
        this.imageService
          .upload(file, this.category(), this.objectId())
          .subscribe(
            (url) => {
              const imageUrl = `/api/files/${url.category}/${url.category}`;
              this.setAlready(imageUrl);
              subscriber.next({ val: value!, imageUrl });
              subscriber.complete();
            },
            (e) => {
              let error = e.error;
              if (typeof error == 'object') {
                error = e?.error?.detail;
              }
              if (
                error?.includes('FileTooLargeException') ||
                error?.includes('RequestTooBigException') ||
                error?.includes('Maximum upload size exceeded')
              ) {
                alert('Image is unable to upload, file size is too large');
              } else {
                alert('Image is unable to upload because of technical issues');
              }
              this.selectedFile.set(null);
              this.selectedFileReview.set(null);
            }
          );
      } else {
        subscriber.next({ val: value!, imageUrl: this.imageUrlAlready()! });
        subscriber.complete();
      }
    });
  }

  removeImage(event: any) {
    this.selectedFileReview.set(null);
    this.setAlready(null);
    this.imageUploaderBtn()!.nativeElement.value = null;
  }

  setAlready(url: string | null) {
    this.imageUrlAlready.set(url);
    this.imageUrlAlreadyChange.emit(url!);
  }
}
