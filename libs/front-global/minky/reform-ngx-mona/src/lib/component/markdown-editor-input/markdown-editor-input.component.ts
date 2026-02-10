import { Component, input } from '@angular/core';
import { InputLinkCarrier, LinkCarrier } from '@lotus/front-global/minky/core';

@Component({
    selector: 'lotus-web-markdown-editor-input',
    templateUrl: './markdown-editor-input.component.html',
    styleUrls: ['./markdown-editor-input.component.scss'],
    standalone: false
})
export class MarkdownEditorInputComponent {
  readonly carrier = input<InputLinkCarrier>();
  readonly imageCategory = input<string>();
  readonly imageObjectId = input<string>();
}
