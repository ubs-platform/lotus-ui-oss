import { Injectable } from '@angular/core';

export const TOKEN_FIELD = 'TK_TOKEN';

@Injectable({ providedIn: 'root' })
export class TokenGetter {
  getToken() {
    return (
      sessionStorage.getItem(TOKEN_FIELD) ?? localStorage.getItem(TOKEN_FIELD)
    );
  }
}
