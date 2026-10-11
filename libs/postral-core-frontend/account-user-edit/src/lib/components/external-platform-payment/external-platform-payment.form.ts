import { minky, minkyRoot, RequiredValidator, MinValidator } from '@lotus/front-global/minky/core';
import { AccountDTO, AccountAddressDto, ExternalPlatformPaymentItemInputDTO, UNIT_TYPES } from '@tk-postral/payment-common';
import { accountTypes, currencyOptions } from '@lotus/postral-core-frontend/forms';

@minkyRoot()
export class ExternalCustomerForm extends AccountDTO {
  @minky({ label: 'Ad / unvan', validators: [new RequiredValidator()] })
  override name = '';

  @minky({
    label: 'Hesap türü', inputType: 'select',
    selectItems: () => accountTypes,
  })
  override type: 'INDIVIDUAL' | 'COMMERCIAL' = 'INDIVIDUAL';

  @minky({ label: 'Kimlik / vergi numarası', validators: [new RequiredValidator()] })
  override legalIdentity = '';

  @minky({ label: 'Vergi dairesi' })
  override taxOffice = '';

  @minky({ label: 'Telefon' })
  override phone = '';

  @minky({ label: 'E-posta' })
  override emailAddress = '';

  @minky({ label: 'Platform müşteri ID (isteğe bağlı)' })
  override externalPlatformAccountId?: string;
}

@minkyRoot()
export class ExternalBillingAddressForm extends AccountAddressDto {
  @minky({ label: 'Adres adı', validators: [new RequiredValidator()] })
  override name = '';

  @minky({ label: 'Ülke kodu', validators: [new RequiredValidator()] })
  override country = 'TR';

  @minky({ label: 'İl / şehir', validators: [new RequiredValidator()] })
  override cityName = '';

  @minky({ label: 'İlçe', validators: [new RequiredValidator()] })
  override citySubdivisionName = '';

  @minky({ label: 'Mahalle' })
  override district = '';

  @minky({ label: 'Cadde / sokak', validators: [new RequiredValidator()] })
  override streetName = '';

  @minky({ label: 'Bina numarası' })
  override buildingNumber = '';

  @minky({ label: 'Bina adı' })
  override buildingName = '';

  @minky({ label: 'Blok' })
  override blockName = '';

  @minky({ label: 'Kat' })
  override floor = '';

  @minky({ label: 'Daire' })
  override room = '';

  @minky({ label: 'Posta kodu', validators: [new RequiredValidator()] })
  override postalZone = '';

  @minky({ label: 'Platform adres ID (isteğe bağlı)' })
  override externalPlatformAddressId?: string;
}

@minkyRoot()
export class ExternalPaymentItemForm extends ExternalPlatformPaymentItemInputDTO {
  @minky({ label: 'Ürün adı', validators: [new RequiredValidator()] })
  override name = '';

  @minky({ label: 'Miktar', inputType: 'number', validators: [new RequiredValidator(), new MinValidator(0)] })
  override quantity = 1;

  @minky({ label: 'Vergi dahil birim fiyat', inputType: 'number', validators: [new RequiredValidator(), new MinValidator(0)] })
  override unitAmount = 0;

  @minky({ label: 'Vergi oranı (%)', inputType: 'number' })
  override taxRate = 20;

  @minky({
    label: 'Birim (UBL kodu)',
    selectItems: () => UNIT_TYPES,
    inputType: 'select',
  })
  override unit = 'C62';

  @minky({ label: 'Postral ürün ID (isteğe bağlı)' })
  override itemId?: string;

  @minky({ label: 'Ürün sınıfı (komisyon)' })
  override itemClass?: string;

  @minky({ label: 'Varyasyon' })
  override variation?: string;
}

@minkyRoot()
export class ExternalPlatformPaymentForm {
  @minky({
    label: 'Satıcı hesabı', inputType: 'select', validators: [new RequiredValidator()],
    selectItems: env => env.parameters?.get('sellerOptions'),
  })
  sellerAccountId = '';

  @minky({
    label: 'Harici platform', inputType: 'select', validators: [new RequiredValidator()],
    selectItems: env => env.parameters?.get('platformOptions'),
  })
  externalPlatformId = '';

  @minky({ label: 'Platform sipariş numarası', validators: [new RequiredValidator()] })
  externalPlatformOrderId = '';

  @minky({
    label: 'Para birimi', inputType: 'select',
    selectItems: () => currencyOptions,
    validators: [new RequiredValidator()],
  })
  currency = 'TRY';

  @minky({ label: 'Müşteri', inputType: 'sub-object', subObjectKey: ExternalCustomerForm })
  customerAccount = new ExternalCustomerForm();

  @minky({ label: 'Fatura adresi', inputType: 'sub-object', subObjectKey: ExternalBillingAddressForm })
  billingAddress = new ExternalBillingAddressForm();

  @minky({
    label: 'Satış kalemleri', inputType: 'array', arrayItemInputType: 'sub-object',
    subObjectKey: ExternalPaymentItemForm, validators: [new RequiredValidator()],
  })
  items = [new ExternalPaymentItemForm()];
}
