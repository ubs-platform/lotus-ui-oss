import { IbanValidator } from './iban';

describe('IbanValidator', () => {
  const validator = new IbanValidator();
  const isValid = (value: any) => validator.validate(value).valid;

  it('geçerli TR IBAN kabul eder (boşluk ve küçük harf normalize edilir)', () => {
    expect(isValid('TR350009901234567800100001')).toBe(true);
    expect(isValid('tr35 0009 9012 3456 7800 1000 01')).toBe(true);
  });

  it('sağlaması hatalı IBAN reddeder', () => {
    expect(isValid('TR760009901234567800100001')).toBe(false);
  });

  it('26 karakter olmayan IBAN reddeder', () => {
    expect(isValid('TR35000990123456780010000')).toBe(false);
    expect(isValid('DE89370400440532013000')).toBe(false);
  });

  it('boş değeri geçerli sayar', () => {
    expect(isValid('')).toBe(true);
    expect(isValid(undefined)).toBe(true);
  });
});
