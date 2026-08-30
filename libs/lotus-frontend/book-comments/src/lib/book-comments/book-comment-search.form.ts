import {
  minky,
  minkyRoot,
  Reform,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { CommentSearchDTO } from '@ubs-platform/social-common';
import { SearchRequest } from '@ubs-platform/crud-base-common';

@minkyRoot({
  fallbackConstruction: () => new BookCommentSearchForm(),
})
export class BookCommentSearchForm
  implements CommentSearchDTO, Partial<SearchRequest>
{
  @minky({
    hide: true,
  })
  entityGroup = '';

  @minky({
    label: 'İçerik içinde',
  })
  contentTextIn?: string;

  @minky({
    hide: true,
  })
  mainEntityId?: string;

  @minky({
    label: 'Sıralama yönü',
    inputType: 'select',
    selectItems: () => [
      { text: 'Yeni/Yüksek -> Eski/Düşük', value: 'desc' },
      { text: 'Eski/Düşük -> Yeni/Yüksek', value: 'asc' },
    ],
  })
  sortRotation?: 'asc' | 'desc' = 'desc';

  @minky({
    label: 'Şuna göre sırala',
    inputType: 'select',
    selectItems: () => [
      { text: 'Puan', value: 'votes' },
      { text: 'general.creation-date', value: 'creationDate' },
    ],
  })
  sortBy?: 'votes' | 'creationDate' = 'creationDate';
}
