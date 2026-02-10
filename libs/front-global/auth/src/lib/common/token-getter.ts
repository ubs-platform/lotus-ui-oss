import { Injectable } from '@angular/core';

export const TOKEN_FIELD = 'TK_TOKEN';

@Injectable({ providedIn: 'root' })
export class TokenGetter {
  getToken() {
    const token = localStorage.getItem(TOKEN_FIELD);
    return token;
  }
}
