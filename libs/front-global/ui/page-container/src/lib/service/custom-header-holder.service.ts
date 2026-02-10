import { TemplateRef } from '@angular/core';

export class CustomHeaderHolderService {
  headerTemplate?: TemplateRef<any>;
  footerTemplate: TemplateRef<any> | undefined;
}
