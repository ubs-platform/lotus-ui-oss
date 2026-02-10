import {
  IUserMessageDto,
  IUserMessageSearch,
} from '@ubs-platform/feedback-common';
import {
  RequiredValidator,
  minky,
  minkyRoot,
} from '@lotus/front-global/minky/core';
@minkyRoot({})
export class UserMessageSearchForm implements IUserMessageSearch {
  @minky({
    inputType: 'select',
    selectItems: () => [
      { text: 'Tümü', value: undefined },
      { text: 'İçerik bildir', value: 'CONTENT_REPORT' },
      { text: 'Hata - Bug', value: 'BUG' },
      { text: 'Öneri', value: 'SUGGESTION' },
      { text: 'Yasak itirazı', value: 'BAN_APPEAL' },
      { text: 'Başka bir şey', value: 'UNCATEGORIZED' },
    ],
  })
  type?: string;
  @minky({ label: 'name' })
  firstName?: string;
  @minky({ label: 'surname' })
  lastName?: string;
  @minky({})
  summary?: string;
  @minky({
    inputType: 'select',
    selectItems: () => [
      { text: 'Bekleyen', value: 'WAITING' },
      { text: 'Çözümlendi', value: 'RESOLVED' },
    ],
  })
  status?: 'WAITING' | 'RESOLVED';
  @minky({})
  relatedUrl?: string;
  @minky({
    inputType: 'datetime',
    label: 'Oluşturma zamanı başlangıç ve ya eşit',
  })
  creationDateGte?: string | Date;
  @minky({
    inputType: 'datetime',
    label: 'Oluşturma zamanı bitiş ve ya eşit',
  })
  creationDateLte?: string | Date;
  // @minky({ label: 'message', validators: [new RequiredValidator()] })
  // message?: string;
  // @minky({ hide: true })
  // fileUrls?: string[];
  // @minky({ validators: [], name: 'phoneNr' })
  // phoneNumber?: String;
}
