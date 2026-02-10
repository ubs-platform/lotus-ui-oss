import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthManagementService } from './services/auth-management.service';
import { AuthService } from './services/auth.service';
import { RequestInterceptor } from './interceptors/bearer-token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  providers: [
    // AuthManagementService,
    // AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
