import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { lotusFrontendPublisherRequestRoutes } from './lib.routes';
import { PublisherRequestComponent } from './component/publisher-request/publisher-request.component';
import { MinkyReformNgxPrimeModule } from '@lotus/front-global/minky/reform-ngx-prime';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { FrontGlobalMarkdownEditorModule } from '@lotus/front-global/markdown-editor';
import { MessageModule } from 'primeng/message';
import { UbsTranslatorNgxModule } from '@ubs-platform/translator-ngx';
import { MinkyReformNgxModule } from '@lotus/front-global/minky/reform-ngx';
import { FrontGlobalMinkyReformNgxMonaModule } from '@lotus/front-global/minky/reform-ngx-mona';
import { OnpageHeaderComponent } from '@lotus/front-global/dynamic-headers';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(lotusFrontendPublisherRequestRoutes),
    RouterModule,
    MinkyReformNgxPrimeModule,
    FrontGlobalButtonModule,
    FrontGlobalMarkdownEditorModule,
    MessageModule,
    MinkyReformNgxModule,
    UbsTranslatorNgxModule,
    FrontGlobalMinkyReformNgxMonaModule,
    OnpageHeaderComponent
  ],
  declarations: [PublisherRequestComponent],
})
export class LotusFrontendPublisherRequestModule {}
