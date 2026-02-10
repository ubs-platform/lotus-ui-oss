import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApplicationSocialRestrictionSearchDTO } from './dto/application-social-restriction.dto';

@NgModule({
  imports: [CommonModule],
})
export class SocialApplicationRestrictionModule {}
