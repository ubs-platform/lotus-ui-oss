import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent as PasswordResetMainComponent } from './components/password-reset-main/password-reset-main.component';
import { InitTabComponent } from './components/init-tab/init-tab.component';
import { SecondStepFormComponent } from './components/second-step-form/second-step-form.component';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetMainComponent,
    children: [
      {
        path: 'init',
        component: InitTabComponent,
        children: [],
      },
      {
        path: 'resolve/:id',
        component: SecondStepFormComponent,
        children: [],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontGlobalPasswordResetRoutingModule {}
