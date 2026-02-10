import { Component, signal } from '@angular/core';
import { TemplateService } from '../../service/template.service';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { EmailTemplateDTO } from '@ubs-platform/notify-common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'lotus-web-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
  standalone: false,
})
export class TemplateListComponent {
  templates: EmailTemplateDTO[] = [];
  isImporting = signal(false);

  constructor(
    private templateService: TemplateService,
    private basicOverlay: BasicOverlayService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reload();
  }

  private reload() {
    this.templateService.fetchAll({}).subscribe((templates) => {
      this.templates = templates;
    });
  }

  remove(id: string) {
    this.basicOverlay
      .confirm('Kaldır', 'Bu şablonu kaldırmaktan emin misiniz?')
      .subscribe((a) => {
        if (a) {
          this.templateService.remove(id).subscribe(() => {
            this.reload();
          });
        }
      });
  }

  importFromJson() {
    this.basicOverlay
      .confirm(
        'JSON İmport Et',
        'JSON dosyasındaki tüm şablonları eklemek istediğinizden emin misiniz?'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.processJsonImport();
        }
      });
  }

  private processJsonImport() {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = e => {

      // getting a hold of the file reference
      var file = input.files?.[0];
      if (!file) {
        alert('Dosya seçilmedi!');
        return;
      }
      // setting up the reader
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
        var content = readerEvent.target!.result; // this is the content!
        let jsonTemplates: EmailTemplateDTO[];
        try {
          jsonTemplates = JSON.parse(content as string);
          if (jsonTemplates.length === 0) {
            alert('JSON dosyası boş veya yüklenemedi!');
            return;
          }

          this.isImporting.set(true);

          // Her template için add metodunu çağır
          const addObservables = jsonTemplates.map(template => {
            // _id'yi kaldır çünkü sunucu tarafında otomatik generate olacak
            const { _id, ...templateWithoutId } = template;
            return this.templateService.add(templateWithoutId as EmailTemplateDTO);
          });

          // Tüm işlemleri paralel olarak çalıştır
          forkJoin(addObservables).subscribe({
            next: (results) => {
              this.isImporting.set(false);
              alert(`${results.length} şablon başarıyla eklendi!`);
              this.reload();
            },
            error: (error) => {
              this.isImporting.set(false);
              console.error('Import hatası:', error);
              alert('Şablonlar eklenirken hata oluştu!');
            }
          });
        } catch (err) {
          alert('Geçersiz JSON formatı!');
          return;
        }

      }



    }
  }
}