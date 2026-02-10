import { Injectable } from '@angular/core';

@Injectable()
export class ThemeManager {
  readonly KEY_THEME = 'theme';
  readonly KEY_AMOLED = 'amoled';
  _selectedTheme: 'dark' | 'light' | null | undefined;

  get theme(): 'dark' | 'light' {
    return (
      this._selectedTheme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light')
    );
  }

  constructor() {
    this.initializeTheme();
  }

  public initializeTheme() {
    const amoled = localStorage.getItem(this.KEY_AMOLED) == 'true',
      theme = localStorage.getItem(this.KEY_THEME);

    document.head.parentElement?.setAttribute(this.KEY_THEME, theme!);
    document.head.parentElement?.setAttribute(this.KEY_AMOLED, amoled + '');
    this._selectedTheme = theme as 'dark' | 'light';
  }

  public setTheme(theme?: 'dark' | 'light' | null, amoled: boolean = false) {
    document.head.parentElement?.setAttribute(this.KEY_THEME, theme + '');
    document.head.parentElement?.setAttribute(this.KEY_AMOLED, amoled + '');
    localStorage.setItem(this.KEY_AMOLED, amoled + '' || '');
    localStorage.setItem(this.KEY_THEME, theme || '');
    this._selectedTheme = theme;
    return true;
  }
}
