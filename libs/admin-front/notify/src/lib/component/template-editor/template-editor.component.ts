import { Component, HostListener } from '@angular/core';
import { TemplateService } from '../../service/template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { Reform } from '@lotus/front-global/minky/core';
import { EmailTemplateForm } from '../../form/email-template.form';
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';
import { EmailTemplateDTO } from '@ubs-platform/notify-common';

@Component({
    selector: 'lotus-web-template-editor',
    templateUrl: './template-editor.component.html',
    styleUrls: ['./template-editor.component.scss'],
    standalone: false
})
export class TemplateEditorComponent {
  id?: string;
  reform?: Reform<EmailTemplateDTO>;

  constructor(
    private templateService: TemplateService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private overlay: BasicOverlayService
  ) {}

  @HostListener('document:keydown', ['$event'])
  keydownOp($event: KeyboardEvent) {
    // windows and generic linux for now
    if ($event.ctrlKey && $event.key == 's') {
      $event.preventDefault();
      this.save(false);
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.activeRoute.params.subscribe((a) => {
      const id = a['id'];
      if (id && id != 'new') {
        this.id = id;
        this.templateService.fetchById(id).subscribe((a) => {
          this.reform = new Reform(EmailTemplateForm, a);
        });
      } else {
        this.reform = new Reform(EmailTemplateForm, {
          _id: '',
          htmlContent: '',
          name: '',
        });
      }
    });
  }

  save(back = true) {
    if (this.reform?.allValidationErrors()?.length) {
      this.reform?.revealAllErrors();
    } else {
      const val = this.reform!.value;
      let act = this.templateService.add(val);
      if (this.id) {
        act = this.templateService.edit(val);
      }
      act.subscribe(() => {
        this.overlay.alert('Şablon başarıyla kaydedildi', '', 'success');
        if (back)
          this.router.navigate(['..'], { relativeTo: this.activeRoute });
      });
    }
  }
}
