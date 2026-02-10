import { IUserMessageDto } from '@ubs-platform/feedback-common';
import {
  RequiredValidator,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';
import { LanguageManagement } from '@lotus/front-global/language-management';
@minkyRoot({})
export class FeedbackForm implements IUserMessageDto {
  @minky({
    inputType: 'select',
    validators: [new RequiredValidator()],
    widthRatio: '50%',
    selectItems: () => {
      return [
        { text: 'İçerik bildir', value: 'CONTENT_REPORT' },
        { text: 'Hata - Bug', value: 'BUG' },
        { text: 'Öneri', value: 'SUGGESTION' },
        { text: 'Yasak itirazı', value: 'BAN_APPEAL' },
        { text: 'Başka bir şey', value: 'UNCATEGORIZED' },
      ];
    },
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
  email!: string;
  @minky({ validators: [], name: 'phoneNr', widthRatio: '50%' })
  phoneNumber?: string;
  @minky({ validators: [new RequiredValidator()] })
  summary?: string;
  @minky({ label: 'message', validators: [new RequiredValidator()] })
  message?: string;
  @minky({
    hide: true,
    selectItems: () => LanguageManagement.LanguagesSelect,
  })
  localeCode?: string;
  // @minky({ hide: true })
  // fileUrls?: IFileMetaDto[];
}
