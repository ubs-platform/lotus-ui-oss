const LEGACY_CHANNEL_PREFIX = '/service/payment/api/';

/**
 * Resolves `PaymentChannelStatusDTO.redirectUrl` into a launchable URL.
 *
 * - Absolute `http(s)` URLs are used as-is.
 * - Paths starting with `/` are resolved against the current origin.
 * - Legacy relative paths (e.g. `dummy-ecommerce-payment-channel/...`) are
 *   resolved under the payment service API prefix.
 *
 * `returnUrl`, when given, is passed to the channel as the `redirectUrl` query parameter.
 */
export function resolvePaymentRedirectUrl(
  redirectUrl: string,
  returnUrl?: string,
  origin: string = location.origin
): string {
  const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(redirectUrl);
  const url = new URL(
    isAbsolute || redirectUrl.startsWith('/')
      ? redirectUrl
      : LEGACY_CHANNEL_PREFIX + redirectUrl,
    origin
  );
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Unsupported payment redirect URL protocol: ${url.protocol}`);
  }
  if (returnUrl) {
    url.searchParams.set('redirectUrl', returnUrl);
  }
  return url.toString();
}
