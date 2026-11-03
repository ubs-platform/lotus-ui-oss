import { ValidatorResult } from '@lotus/front-global/minky/core';

/** Accepts only bare http(s) origins such as `https://app.example.com`, matching Postral's whitelist rules. */
export function isReturnOrigin(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value.trim());
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      url.pathname === '/' &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export const returnOriginsValidator = {
  labelKey: 'postral.platform-setup.allowed-return-origins-help',
  validate: (value: unknown) =>
    new ValidatorResult(
      'postral.platform-setup.allowed-return-origins-help',
      value == null || (Array.isArray(value) && value.every(isReturnOrigin)),
    ),
};
