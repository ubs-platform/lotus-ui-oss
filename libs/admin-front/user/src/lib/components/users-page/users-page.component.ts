import { Component, OnInit } from '@angular/core';
import {
  UserAuthBackendDTO,
  UserDTO,
  UserFullDto,
} from '@ubs-platform/users-common';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { mergeMap, of } from 'rxjs';
import { CommentAdminService } from '@lotus/front-global/social-comments';
import {
  AddRestrictionForm,
  ApplicationSocialRestrictionAdminService,
  ApplicationSocialRestrictionService,
} from '@lotus/front-global/social-application-restriction';
import { Reform } from '@lotus/front-global/minky/core';
import { AdminSocialOptionsComponent } from '@lotus/front-global/admin-social-options';
import { UserAdminService } from '@lotus/front-global/auth';

@Component({
  selector: 'lotus-web-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  standalone: false,
})
export class UsersPageComponent implements OnInit {

  users: UserAuthBackendDTO[] = [];

  readonly SEARCH_URL: string;
  constructor(
    private secondaryOverlay: BasicOverlayService,
    private ua: UserAdminService,

  ) {
    this.SEARCH_URL = `${this.ua.RESOURCE_URL}/_search`;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers() {
    this.ua.listAllUsers().subscribe((a) => {
      this.users = a;
    });
  }

  removeUser(arg0: any) {
    this.secondaryOverlay
      .confirm('users.delete', 'users.delete.question')
      .pipe(mergeMap((a) => (a ? this.ua.delete(arg0) : of(null))))
      .subscribe((a) => {
        if (a) {
          this.secondaryOverlay.alert('success', 'success', 'success');
          this.loadUsers();
        }
      });
  }


  showSocialOptions(user: UserAuthBackendDTO) {
    this.secondaryOverlay.showComponentAsDialog(AdminSocialOptionsComponent, {
      data: { user },
      defaultOutValue: null,
    });
  }


}
