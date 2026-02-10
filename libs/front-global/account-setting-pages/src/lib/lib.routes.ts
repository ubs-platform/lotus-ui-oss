import { Route } from '@angular/router';
import { MainViewComponent } from './components/main-view/main-view.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';
import { ProfilePhotoComponent } from './components/profile-photo/profile-photo.component';
import { SecuritySettingsComponent } from './components/security-settings/security-settings.component';

export const frontGlobalAccountSettingPagesRoutes: Route[] = [
  {
    path: '',
    component: MainViewComponent,
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: AccountInformationComponent },
      { path: 'thumb-photo', component: ProfilePhotoComponent },
      { path: 'security', component: SecuritySettingsComponent },
    ],
  },
];
