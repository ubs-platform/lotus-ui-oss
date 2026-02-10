import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotusFrontendBooksModule } from '@lotus/lotus-frontend/books';
import { RegistrationComponent } from './components/registration/registration.component';
import { CaptachaComponent } from './components/captacha/captacha.component';
import { InformationTabComponent } from './components/information-tab/information-tab.component';
import { RegistrationCompletionComponent } from './components/registration-completion/registration-completion.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    children: [
      { path: '', redirectTo: 'captacha', pathMatch: 'prefix' },
      { path: 'captacha', component: CaptachaComponent },
      { path: 'information', component: InformationTabComponent },
      { path: 'completion', component: RegistrationCompletionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontGlobalRegistrationRoutingModule {}
