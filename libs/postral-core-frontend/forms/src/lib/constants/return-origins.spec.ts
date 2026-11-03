import { isReturnOrigin, returnOriginsValidator } from './return-origins';

describe('return origins', () => {
  it('accepts bare http(s) origins', () => {
    expect(isReturnOrigin('https://app.example.com')).toBe(true);
    expect(isReturnOrigin('http://localhost:4200/')).toBe(true);
  });

  it.each([
    'https://app.example.com/path',
    'https://app.example.com/?x=1',
    'https://u:p@app.example.com',
    'javascript:alert(1)',
    'app.example.com',
    '',
    5,
  ])('rejects %p', (value) => {
    expect(isReturnOrigin(value)).toBe(false);
  });

  it('validates every list item', () => {
    expect(returnOriginsValidator.validate(['https://app.example.com']).valid).toBe(true);
    expect(returnOriginsValidator.validate(undefined).valid).toBe(true);
    expect(returnOriginsValidator.validate(['https://app.example.com', 'bad']).valid).toBe(false);
  });
});
