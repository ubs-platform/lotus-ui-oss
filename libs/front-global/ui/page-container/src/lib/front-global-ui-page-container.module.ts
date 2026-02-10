import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexyPageContainerComponent } from './component/flexy-page-container/flexy-page-container.component';
import { HeaderlessPageContainerComponent } from './component/headerless-page-container/headerless-page-container.component';
import { PageContainerComponent } from './component/page-container/page-container.component';
import { RouterModule } from '@angular/router';
import { ContainerRulerComponent } from './component/container-ruler/container-ruler.component';
import { HeaderlessDwhPageContainerComponent } from './component/headerless-dwh-page-container/headerless-dwh-page-container.component';
import { FullwidthPageContainerComponent } from './component/fullwidth-page-container/fullwidth-page-container.component';
import { HeaderlessScreenCoverPageContainerComponent } from './component/headerless-screen-cover-page-container/headerless-screen-cover-page-container.component';
import { FlexyPageNoRulerContainerComponent } from './component/flexy-page-noruler-container/flexy-page-noruler-container.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    PageContainerComponent,
    HeaderlessPageContainerComponent,
    FlexyPageContainerComponent,
    ContainerRulerComponent,
    HeaderlessDwhPageContainerComponent,
    FullwidthPageContainerComponent,
    HeaderlessScreenCoverPageContainerComponent,
    FlexyPageNoRulerContainerComponent,
  ],
  exports: [
    PageContainerComponent,
    HeaderlessPageContainerComponent,
    FlexyPageContainerComponent,
    ContainerRulerComponent,
    FullwidthPageContainerComponent,
    HeaderlessScreenCoverPageContainerComponent,
    FlexyPageNoRulerContainerComponent,
  ],
})
export class FrontGlobalUiPageContainerModule {}
