import { Component, OnInit } from '@angular/core';

export const PAYMENT_RETURN_MESSAGE_TYPE = 'postral-payment-return';

/**
 * Landing page a payment channel redirects to when its page is shown in the
 * payment dialog's iframe; notifies the parent page so it can close the dialog.
 */
@Component({
  selector: 'lib-payment-return',
  standalone: true,
  template: `<p class="payment-return">Ödeme işlemi tamamlandı. Bu pencere kapatılabilir.</p>`,
  styles: [`.payment-return { padding: 1rem; text-align: center; }`],
})
export class PaymentReturnComponent implements OnInit {
  ngOnInit(): void {
    if (window.parent !== window) {
      window.parent.postMessage({ type: PAYMENT_RETURN_MESSAGE_TYPE }, location.origin);
    }
  }
}
