import { Component, computed, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWebDialogConfig, WEBDIALOG_CONFIG, WebdialogComponent } from '@lotus/front-global/webdialog';
import { FrontGlobalButtonModule } from '@lotus/front-global/button';
import { BasicOverlayService } from '@lotus/front-global/prompt-overlays';
import { CommentAdminService } from '@lotus/front-global/social-comments';
import {
  AddRestrictionForm,
  ApplicationSocialRestrictionAdminService,
  ApplicationSocialRestrictionService,
} from '@lotus/front-global/social-application-restriction';
import { Reform } from '@lotus/front-global/minky/core';
import { UserAuthBackendDTO } from '@ubs-platform/users-common';
import { mergeMap, of } from 'rxjs';
import { UserAdminService } from '@lotus/front-global/auth';

@Component({
  selector: 'lib-admin-social-options',
  imports: [CommonModule, FrontGlobalButtonModule],
  providers: [CommentAdminService, ApplicationSocialRestrictionAdminService, UserAdminService],
  templateUrl: './admin-social-options.component.html',
  styleUrl: './admin-social-options.component.css',
})
export class AdminSocialOptionsComponent {
  socialDialogUser = signal<UserAuthBackendDTO | null>(null);
  socialDialogShow = signal(false);
  socialDialogUserSocialRestriction = signal(false);
  userIsAdmin = computed(() => {
    const user = this.socialDialogUser();
    if (!user) {
      return false;
    }
    return user.roles.includes('ADMIN');
  });


  /**
   *
   */
  constructor(
    @Inject(WEBDIALOG_CONFIG) private webdialogConfig: IWebDialogConfig<{ user?: UserAuthBackendDTO, userId?: string }, null>,
    private secondaryOverlay: BasicOverlayService, private commentAdService: CommentAdminService,
    private userAdminService: UserAdminService,
    private restriction: ApplicationSocialRestrictionAdminService) {
    if (this.webdialogConfig.data?.user) {
      this.initializeDialog(this.webdialogConfig.data.user);
    } else if (this.webdialogConfig.data?.userId) {
      this.userAdminService.fetchOne(this.webdialogConfig.data.userId).subscribe((user) => {
        this.initializeDialog({
          ...user,
          id: user._id,
        
        });
      });
    }
  }

  initializeDialog(user: UserAuthBackendDTO) {
    this.socialDialogShow.set(true);
    this.socialDialogUser.set(user);
    this.restriction
      .userRestrictionDetail({ userId: user.id, restriction: 'COMMENT' })
      .subscribe((a) => {
        this.socialDialogUserSocialRestriction.set(a != null);
      });
  }


  clearComments(user: UserAuthBackendDTO) {
    this.secondaryOverlay
      .confirm(
        'Yorumları Temizle',
        `${user.name} ${user.surname} kullanıcısının yorumlarını temizlemek istediğinizden emin misiniz?`
      )
      .subscribe((a) => {
        if (a) {
          this.commentAdService.clearCommentsOfUser(user.id).subscribe(() => {
            this.secondaryOverlay.alert('Yorumlar temizlendi', '', 'success');
          });
        }
      });
  }

  unblockComments(user: UserAuthBackendDTO) {
    this.secondaryOverlay
      .confirm(
        'Yorumlara izin ver',
        `${user.name} ${user.surname} kullanıcısının YORUMlarını tekrar ETKİNLEŞTİMEK istediğinizden emin misiniz?`
      )
      .subscribe((a) => {
        if (a) {
          this.restriction
            .deleteUserRestriction({
              userId: user.id,
              restriction: 'COMMENT',
            })
            .subscribe(() => {
              this.socialDialogUserSocialRestriction.set(false);
              this.secondaryOverlay.alert(
                'Yorum yapma etkinleştirildi',
                '',
                'success'
              );
            });
        }
      });
  }

  blockComments(user: UserAuthBackendDTO) {
    const r = new Reform<AddRestrictionForm>(AddRestrictionForm);
    const extraErrorCheck = () => {
      if (!r.value.endless && !r.value.until) {
        return 'Eğer süresiz engellenmeyecekse tarih girilmelidir.';
      }
      return null;
    };
    this.secondaryOverlay
      .confirm(
        'Yorumlarını engelle',
        `${user.name} ${user.surname} kullanıcısının yorumlarını ENGELLEMEK istediğinizden emin misiniz?`
      )
      .pipe(
        mergeMap((a) =>
          !a
            ? of(false)
            : this.secondaryOverlay.reformDialog(
              r,
              'Engelleme formunu dolduun',
              extraErrorCheck
            )
        )
      )
      .subscribe((a) => {
        if (a) {
          this.restriction
            .addUserRestriction({
              until: r.value.endless ? null : r.value.until.toISOString(),
              note: r.value.note,
              userId: user.id,
              restriction: 'COMMENT',
            })
            .subscribe(() => {
              this.socialDialogUserSocialRestriction.set(true);
              this.secondaryOverlay.alert(
                'Yorumları engellendi',
                '',
                'success'
              );
            });
        }
      });
  }
}
