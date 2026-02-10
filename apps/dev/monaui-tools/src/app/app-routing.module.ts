import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  NotFoundPageComponent,
  SuspendedPageComponent,
} from '@lotus/front-global/error-status-pages';
import {
  PageContainerComponent,
  FlexyPageContainerComponent,
  HeaderlessPageContainerComponent,
  FullwidthPageContainerComponent,
  HeaderlessScreenCoverPageContainerComponent,
  FlexyPageNoRulerContainerComponent,
} from '@lotus/front-global/ui/page-container';
import { HeaderlessDwhPageContainerComponent } from 'libs/front-global/ui/page-container/src/lib/component/headerless-dwh-page-container/headerless-dwh-page-container.component';
import { CoretoolComponent } from './components/coretool/coretool.component';

const routes: Routes = [
  {
    path: '',
    component: CoretoolComponent,
  },

  {
    component: PageContainerComponent,
    path: '**',
    children: [
      {
        component: NotFoundPageComponent,
        path: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
