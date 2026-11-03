import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  input,
  model,
} from '@angular/core';
import Quill from 'quill';
import { InputLinkCarrier } from '@lotus/front-global/minky/core';
import { IndexAutoLoadElement, IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';

@Component({
    selector: 'lotus-web-code-editor-input',
    templateUrl: './code-editor-input.component.html',
    styleUrls: ['./code-editor-input.component.scss'],
    standalone: false
})
export class CodeEditorInputComponent implements OnInit {
  readonly sourceEditor = model(true);
  readonly monacoOps = model({ theme: 'vs-dark', language: 'html' });
  readonly carrier = input<InputLinkCarrier>();
  private readonly indexAutoLoader = inject(IndexAutoLoader);

  @ViewChild('quillEditor')
  set quillEditor(element: ElementRef<HTMLElement> | undefined) {
    if (!element) {
      return;
    }

    const quill = new Quill(element.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
        ],
      },
    });
    const value = this.carrier()?.value;
    if (typeof value === 'string' && value) {
      quill.clipboard.dangerouslyPasteHTML(value, 'silent');
    }
    quill.on('text-change', () => this.carrier()?.setValue(quill.root.innerHTML));
  }

  ngOnInit(): void {
    this.indexAutoLoader.register(
      // quill/dist/quill.snow.css
      new IndexAutoLoadElement(
        'quill-core-css',
        'CSS',
        'dependencies/quill/quill.core.css'
      ),
      new IndexAutoLoadElement(
        'quill-snow-css',
        'CSS',
        'dependencies/quill/quill.snow.css'
      )
    );
  }
}
