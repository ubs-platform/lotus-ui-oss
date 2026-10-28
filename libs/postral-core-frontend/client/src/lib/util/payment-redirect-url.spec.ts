import { resolvePaymentRedirectUrl } from './payment-redirect-url';

describe('resolvePaymentRedirectUrl', () => {
  const origin = 'https://app.test';

  it('resolves root-relative channel paths against the current origin', () => {
    expect(
      resolvePaymentRedirectUrl(
        '/service/payment/api/iyzico/operation/op-1',
        'https://app.test/return?x=1',
        origin
      )
    ).toBe(
      'https://app.test/service/payment/api/iyzico/operation/op-1?redirectUrl=https%3A%2F%2Fapp.test%2Freturn%3Fx%3D1'
    );
  });

  it('keeps legacy relative channel paths under the payment API prefix', () => {
    expect(
      resolvePaymentRedirectUrl('dummy-ecommerce-payment-channel/operation/op-2', undefined, origin)
    ).toBe('https://app.test/service/payment/api/dummy-ecommerce-payment-channel/operation/op-2');
  });

  it('uses absolute channel URLs as-is', () => {
    expect(
      resolvePaymentRedirectUrl('https://sandbox.example/pay?token=t', undefined, origin)
    ).toBe('https://sandbox.example/pay?token=t');
  });

  it('rejects non-http protocols', () => {
    expect(() => resolvePaymentRedirectUrl('javascript:alert(1)', undefined, origin)).toThrow();
  });
});
