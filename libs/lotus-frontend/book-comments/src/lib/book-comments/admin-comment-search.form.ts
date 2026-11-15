import { minky, minkyRoot } from '@lotus/front-global/minky/core';
import { CommentSearchDTO } from '@ubs-platform/social-common';
import { SearchRequest } from '@ubs-platform/crud-base-common';

/**
 * Santral (adminMode) yorum araması. `flags` ve `moderationStatus` backend'de
 * sadece moderatör için uygulanır. minky'de `hide` statik olduğu için
 * BookCommentSearchForm'dan ayrı bir sınıf.
 */
@minkyRoot({
  fallbackConstruction: () => new AdminCommentSearchForm(),
})
export class AdminCommentSearchForm
  implements CommentSearchDTO, Partial<SearchRequest>
{
  @minky({ hide: true })
  entityGroup = '';

  @minky({ label: 'İçerik içinde' })
  contentTextIn?: string;

  @minky({
    label: 'Flag (virgülle ayırın)',
    description: 'Herhangi biri eşleşen yorumlar listelenir.',
  })
  flags?: string = '';

  @minky({
    label: 'Görünürlük',
    inputType: 'select',
    selectItems: () => [
      { text: 'Tümü', value: '' },
      { text: 'Sadece görünür', value: 'VISIBLE' },
      { text: 'Sadece gizli (shadow)', value: 'SHADOW' },
    ],
  })
  moderationStatus?: 'VISIBLE' | 'SHADOW';

  @minky({ hide: true })
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

export const FLAG_FORM_PARAM_SUGGESTIONS = 'flagSuggestions';

@minkyRoot({
  fallbackConstruction: () => new CommentFlagAddForm(),
})
export class CommentFlagAddForm {
  @minky({
    label: 'Flag',
    description: 'Serbest metin; mevcut pattern flag\'leri öneri olarak listelenir.',
    selectItems: (env) =>
      ((env.parameters.get(FLAG_FORM_PARAM_SUGGESTIONS) as string[]) ?? []).map(
        (a) => ({ text: a, value: a })
      ),
  })
  flag = '';
}
