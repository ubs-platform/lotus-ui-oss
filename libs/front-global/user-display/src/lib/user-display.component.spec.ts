import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDisplayComponent } from './user-display.component';

describe('UserDisplayComponent', () => {
  let fixture: ComponentFixture<UserDisplayComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UserDisplayComponent] }).compileComponents();
    fixture = TestBed.createComponent(UserDisplayComponent);
    element = fixture.nativeElement;
  });

  it('displays user name, surname, username and the profile photo by ID', () => {
    fixture.componentRef.setInput('user', { id: 'user-id', name: 'Ada', surname: 'Lovelace', username: 'ada' });
    fixture.detectChanges();
    expect(element.textContent).toContain('Ada Lovelace');
    expect(element.textContent).toContain('@ada');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/api/file/PROFILE_PHOTO/user-id');
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it('accepts gift sender userId and encodes it as one URL segment', () => {
    fixture.componentRef.setInput('user', { userId: 'user/id?', name: 'Ada' });
    fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/api/file/PROFILE_PHOTO/user%2Fid%3F');
  });

  it.each([null, undefined])('displays anonymous without a photo request for %s', user => {
    fixture.componentRef.setInput('user', user);
    fixture.detectChanges();
    expect(element.textContent).toContain('Anonim');
    expect(element.querySelector('img')).toBeNull();
    expect(fixture.componentInstance.photoUrl()).toBeNull();
  });

  it('allows an explicit deleted-account label without inferring it from a missing photo', () => {
    fixture.componentRef.setInput('missingState', 'deleted');
    fixture.detectChanges();
    expect(element.textContent).toContain('Silinmiş hesap');
    expect(element.querySelector('img')).toBeNull();
    fixture.componentRef.setInput('user', { name: 'Ada' });
    fixture.detectChanges();
    expect(element.textContent).toContain('Ada');
    expect(element.textContent).not.toContain('Silinmiş hesap');
  });

  it('removes all visible identity and the photo when the user becomes anonymous', () => {
    fixture.componentRef.setInput('user', { userId: 'secret-id', name: 'Private', surname: 'Person', username: 'private' });
    fixture.detectChanges();
    fixture.componentRef.setInput('user', null);
    fixture.detectChanges();
    expect(element.textContent).toContain('Anonim');
    expect(element.innerHTML).not.toContain('secret-id');
    expect(element.innerHTML).not.toContain('Private');
    expect(element.innerHTML).not.toContain('@private');
    expect(element.querySelector('img')).toBeNull();
  });

  it('supports hiding the secondary username for tables that already have a username column', () => {
    fixture.componentRef.setInput('user', { name: 'Ada', username: 'ada' });
    fixture.componentRef.setInput('showUsername', false);
    fixture.detectChanges();
    expect(element.textContent).toContain('Ada');
    expect(element.textContent).not.toContain('@ada');
  });

  it('provides an accessible avatar-only mode with initials after an image error', () => {
    fixture.componentRef.setInput('user', { id: 'user-id', name: 'Ada', surname: 'Lovelace', username: 'ada' });
    fixture.componentRef.setInput('showIdentity', false);
    fixture.detectChanges();
    expect(element.querySelector('.identity')).toBeNull();
    expect(element.getAttribute('role')).toBe('img');
    expect(element.getAttribute('aria-label')).toBe('Ada Lovelace');
    element.querySelector('img')?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(element.querySelector('.avatar')?.textContent).toBe('AL');
    expect(element.querySelector('img')).toBeNull();
    expect(element.getAttribute('aria-label')).toBe('Ada Lovelace');
  });

  it('uses username as primary label when the full name is missing', () => {
    fixture.componentRef.setInput('user', { username: 'ada', name: '  ' });
    fixture.detectChanges();
    expect(element.textContent).toContain('@ada');
    expect(element.querySelector('.username')).toBeNull();
  });

  it('falls back to initials after photo failure and tries a new user photo', () => {
    fixture.componentRef.setInput('user', { id: 'first', name: 'Ada', surname: 'Lovelace' });
    fixture.detectChanges();
    element.querySelector('img')?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.avatar')?.textContent).toBe('AL');
    expect(element.textContent).toContain('Ada Lovelace');
    fixture.componentRef.setInput('user', { id: 'second', name: 'Other' });
    fixture.detectChanges();
    expect(element.querySelector('img')?.getAttribute('src')).toBe('/api/file/PROFILE_PHOTO/second');
  });
});
