import { RequiredValidator, minky, minkyRoot } from '@lotus/front-global/minky/core';
import { EmailTemplateDTO } from '@ubs-platform/notify-common';

@minkyRoot()
export class EmailTemplateForm implements EmailTemplateDTO {
  @minky({ disable: true, widthRatio: '50%' })
  _id: any;
  @minky({ validators: [new RequiredValidator()], widthRatio: '50%' })
  name!: string;

  @minky({})
  htmlContent!: string;
}
