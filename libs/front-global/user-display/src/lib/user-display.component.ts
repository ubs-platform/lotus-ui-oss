import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface UserDisplayInfo {
  id?: string;
  userId?: string;
  name?: string;
  surname?: string;
  username?: string;
}

export type MissingUserState = 'anonymous' | 'deleted';

@Component({
  selector: 'lotus-web-user-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '!showIdentity() ? "img" : null',
    '[attr.aria-label]': '!showIdentity() ? displayName() : null',
  },
  template: `
    @if (photoUrl(); as url) {
      @if (failedPhotoUrl() !== url) {
        <img [src]="url" alt="" width="50" height="50" (error)="failedPhotoUrl.set(url)" />
      } @else {
        <span class="avatar" aria-hidden="true">{{ initials() }}</span>
      }
    } @else {
      <span class="avatar" aria-hidden="true">{{ user() ? initials() : '?' }}</span>
    }
    @if (showIdentity()) {
      <span class="identity">
        <span>{{ displayName() }}</span>
        @if (user()?.username && showUsername() && fullName()) {
          <span class="username">{{ '@' + user()?.username }}</span>
        }
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 100%;
    }
    img, .avatar {
      width: var(--user-avatar-size, 50px);
      height: var(--user-avatar-size, 50px);
      border-radius: 50%;
      flex-shrink: 0;
      object-fit: cover;
    }
    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-1);
      color: var(--fg);
      font-size: calc(var(--user-avatar-size, 50px) * 0.4);
    }
    .identity { display: flex; flex-direction: column; min-width: 0; overflow-wrap: anywhere; }
    .username { font-size: 0.875em; }
  `,
})
export class UserDisplayComponent {
  readonly user = input<UserDisplayInfo | null | undefined>(null);
  readonly missingState = input<MissingUserState>('anonymous');
  readonly showUsername = input(true);
  readonly showIdentity = input(true);
  readonly failedPhotoUrl = signal<string | null>(null);
  readonly fullName = computed(() =>
    [this.user()?.name?.trim(), this.user()?.surname?.trim()].filter(Boolean).join(' ')
  );
  readonly displayName = computed(() => {
    const user = this.user();
    if (!user) {
      return this.missingState() === 'deleted' ? 'Silinmiş hesap' : 'Anonim';
    }
    return this.fullName() || (user.username ? `@${user.username}` : 'Kullanıcı');
  });
  readonly photoUrl = computed(() => {
    const id = this.user()?.id || this.user()?.userId;
    return id ? `/api/file/PROFILE_PHOTO/${encodeURIComponent(id)}` : null;
  });
  readonly initials = computed(() =>
    [this.user()?.name?.trim(), this.user()?.surname?.trim()]
      .filter(Boolean).map(part => part?.charAt(0)).join('').toLocaleUpperCase('tr-TR') || '?'
  );
}
