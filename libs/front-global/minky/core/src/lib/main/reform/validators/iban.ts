import { Validator, IValidatorResult, ValidatorResult } from '../validator';

/** IBAN'daki boşlukları siler ve harfleri büyütür. */
export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}

/** ISO 13616 mod-97 sağlaması; geçerli IBAN'da kalan 1 olur. */
export function isIbanChecksumValid(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /\d/.test(char)
      ? char
      : (char.charCodeAt(0) - 55).toString(); // A=10 ... Z=35
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}

/**
 * IBAN biçimini doğrular: 26 karakter, iki harfli ülke kodu, iki haneli
 * kontrol basamağı ve mod-97 sağlaması. Boş değer geçerli sayılır; zorunluluk
 * için `RequiredValidator` kullanılmalıdır.
 */
export class IbanValidator implements Validator {
  labelKey = 'iban-format';
  static readonly LENGTH = 26;

  validate(value: any): IValidatorResult {
    const raw = value == null ? '' : String(value);
    if (raw.trim() === '') {
      return new ValidatorResult(this.labelKey, true);
    }
    const iban = normalizeIban(raw);
    const valid =
      iban.length === IbanValidator.LENGTH &&
      /^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban) &&
      isIbanChecksumValid(iban);
    return new ValidatorResult(this.labelKey, valid);
  }
}
