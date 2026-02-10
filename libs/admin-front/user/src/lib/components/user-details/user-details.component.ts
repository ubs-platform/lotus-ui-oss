import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, of } from 'rxjs';
import { UserFullDto } from '@ubs-platform/users-common';
import { Reform } from '@lotus/front-global/minky/core';
import { UserAdminService, UserFullForm } from '@lotus/front-global/auth';
import { PredefinedDataManager } from '@lotus/front-global/predefined-data';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';

@Component({
    selector: 'lotus-web-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
    standalone: false
})
export class UserDetailsComponent implements OnInit {
  user?: UserFullDto;
  reform?: Reform<UserFullDto>;
  constructor(
    private activeRoute: ActivatedRoute,
    private sds: UserAdminService,
    private predefinedDataManager: PredefinedDataManager,
    private basicOverlay: BasicOverlayService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(mergeMap(({ id }) => (id ? this.sds.fetchOne(id) : of(null))))
      .subscribe((a) => {
        this.initReform(a);
      });
  }

  private initReform(a?: UserFullDto | null) {
    if (a == null) {
      a = new UserFullForm();
    }
    this.user = a;
    this.reform = new Reform(UserFullForm, a);
  }

  save() {
    if (this.reform?.allValidationErrors().length) {
      this.basicOverlay.alert('validationerror', 'validationerror', 'error');
    } else {
      if (this.reform?.value?._id) {
        this.sds.editOne(this.reform?.value).subscribe((a) => {
          this.basicOverlay.alert('mona.success-save', null, 'success');
        });
      } else {
        this.sds.addUser(this.reform?.value).subscribe((a) => {
          this.basicOverlay.alert('mona.success-save', null, 'success');
          this.router.navigate(['..'], { relativeTo: this.activeRoute });
        });
      }
    }
  }
}
