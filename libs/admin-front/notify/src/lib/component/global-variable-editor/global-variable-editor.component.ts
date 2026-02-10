import { Component, signal } from '@angular/core';
import { GlobalVariableService } from '../../service/global-variable.service';
import { DialogService } from 'primeng/dynamicdialog';
import { GlobalVariableChangeModalComponent } from '../global-variable-change-modal/global-variable-change-modal.component';
import {
  GlobalVariableDTO,
  GlobalVariableJsonDTO,
  GlobalVariableWriteDTO,
} from '@ubs-platform/notify-common';
import { forkJoin, Observable } from 'rxjs';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { GlobalVariableWriteForm } from '../../form/global-variable-write.form';
import { Reform } from '@lotus/front-global/minky/core';

@Component({
  selector: 'lotus-web-global-variable-editor',
  templateUrl: './global-variable-editor.component.html',
  styleUrls: ['./global-variable-editor.component.scss'],
  standalone: false
})
export class GlobalVariableEditorComponent {
  isImporting = signal(false);

  globalVars: GlobalVariableDTO[] = [];

  constructor(
    public globalVarsService: GlobalVariableService,
    private basicOverlay: BasicOverlayService,
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reload();
  }

  private reload() {
    this.globalVarsService.list().subscribe((a) => {
      this.globalVars = a;
    });
  }

  edit(gv: GlobalVariableDTO, language: string, value: string) {
    this.showEditInsertDialog(gv.name, language, value, Object.keys(gv.values));
  }

  insertNew() {
    const langKeys = Object.keys(
      this.globalVars.reduce((a, b) => (a = { ...a, ...b.values }), {})
    );
    this.showEditInsertDialog('', '', '', langKeys);
  }

  private showEditInsertDialog(
    name: string,
    language: string,
    value: string,
    langKeys: string[]
  ) {
    const data = {
      name: name,
      language: language,
      value: value,
      _otherLanguages: langKeys || [],
      _otherNames: this.globalVars.map((a) => a.name) || [],
    };
    const reform = new Reform<GlobalVariableWriteForm>(
      GlobalVariableWriteForm,
      data
    );
    this.basicOverlay.reformDialog(
      reform,
      'Global Değişken ekle/düzenle'
    ).subscribe(result => {
      if (result) {
        this.globalVarsService.edit(reform.value).subscribe(() => {
          this.reload();
        });
      }
    });


    // ref.onClose().subscribe(() => this.reload());
  }

  rename(_t7: GlobalVariableDTO, newName?: string) {
    // this.dialogService.
    if (newName) {
      this.globalVarsService.rename(_t7.id, newName).subscribe((a) => {
        _t7.name = a.name;
      });
    }
  }
  dublicate(_t7: GlobalVariableDTO) {
    this.globalVarsService.dublicate(_t7.id).subscribe((a) => {
      this.globalVars.push(a);
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
        let jsonTemplates: GlobalVariableJsonDTO[];
        try {
          jsonTemplates = JSON.parse(content as string);
          if (jsonTemplates.length === 0) {
            alert('JSON dosyası boş veya yüklenemedi!');
            return;
          }

          this.isImporting.set(true);
          const globalVariableUpdateObservables: Observable<GlobalVariableDTO>[] = [];
          for (let index = 0; index < jsonTemplates.length; index++) {
            const normalDto = jsonTemplates[index];
            Object.entries(normalDto.values || {}).forEach(([language, value]) => {
              if (normalDto.name.trim() === '' || value.trim() === '' || language.trim() === '') {
                this.basicOverlay.alert('Hata', `İsim, dil veya değer boş olamaz! Atlanan değişken: ${JSON.stringify(normalDto)}`, "error");
                return;
              }
              globalVariableUpdateObservables.push(this.globalVarsService.edit({
                name: normalDto.name,
                value: value,
                language: language,
              }));
            });
          }


          // Tüm işlemleri paralel olarak çalıştır
          forkJoin(globalVariableUpdateObservables).subscribe({
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
          console.error(err);
          return;
        }

      }



    }
  }
}
