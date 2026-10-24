import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomHeaderHolderService {
  headerTemplate?: TemplateRef<any>;
  footerTemplate: TemplateRef<any> | undefined;
}
