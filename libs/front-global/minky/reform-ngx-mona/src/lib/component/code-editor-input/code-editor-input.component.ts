import { Component, OnInit, input, model } from '@angular/core';
import { InputLinkCarrier, LinkCarrier } from '@lotus/front-global/minky/core';
import { IndexAutoLoadElement, IndexAutoLoader } from '@lotus/front-global/ngx-index-auto-load';

@Component({
    selector: 'lotus-web-code-editor-input',
    templateUrl: './code-editor-input.component.html',
    styleUrls: ['./code-editor-input.component.scss'],
    standalone: false
})
export class CodeEditorInputComponent implements OnInit {
  readonly sourceEditor = model(false);
  readonly monacoOps = model({ theme: 'vs-dark', language: 'html' });
  readonly carrier = input<InputLinkCarrier>();
  constructor(public indexAutoLoader: IndexAutoLoader) {}
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
