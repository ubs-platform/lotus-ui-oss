import { TOKEN_FIELD, TokenGetter } from './token-getter';

describe('TokenGetter', () => {
  const getter = new TokenGetter();

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('returns null when neither storage has a token', () => {
    expect(getter.getToken()).toBeNull();
  });

  it('reads existing persistent tokens', () => {
    localStorage.setItem(TOKEN_FIELD, 'persistent');

    expect(getter.getToken()).toBe('persistent');
  });

  it('reads session tokens after recreating the getter', () => {
    sessionStorage.setItem(TOKEN_FIELD, 'session');

    expect(new TokenGetter().getToken()).toBe('session');
  });

  it('prefers the current tab session over a persistent token', () => {
    localStorage.setItem(TOKEN_FIELD, 'persistent');
    sessionStorage.setItem(TOKEN_FIELD, 'session');

    expect(getter.getToken()).toBe('session');
  });
});
