import { Route } from '@angular/router';
import { GlobalVariableEditorComponent } from './component/global-variable-editor/global-variable-editor.component';
import { TemplateListComponent } from './component/template-list/template-list.component';
import { TemplateEditorComponent } from './component/template-editor/template-editor.component';

export const rota: Route[] = [
  { path: 'global-var', component: GlobalVariableEditorComponent },
  { path: 'template', component: TemplateListComponent },
  { path: 'template/:id', component: TemplateEditorComponent },
];
