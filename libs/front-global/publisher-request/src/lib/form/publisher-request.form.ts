import { IUserMessageDto } from '@ubs-platform/feedback-common';
import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';
@minkyRoot({
  fallbackConstruction: () => new PublisherRequestForm(),
})
export class PublisherRequestForm {
  @minky({
    hide: true,
  })
  type?: string;
  @minky({
    label: 'name',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  firstName?: string;
  @minky({
    label: 'surname',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  lastName?: string;
  @minky({
    label: 'email',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
  })
  email?: string;
  @minky({
    validators: [new RequiredValidator()],
    name: 'phoneNr',
    widthRatio: '50%',
  })
  phoneNumber?: string;

  @minky({
    label: 'Kendiniz hakkında bilgi verin.',
    validators: [new RequiredValidator()],
  })
  message?: string;
  @minky({ inputType: 'file', label: 'CV', validators: [] })
  cv?: File;
  @minky({
    inputType: 'file',
    label: 'Diploma ya da E-Devlet YÖK belgesi',
    validators: [],
  })
  degree?: File;
}
