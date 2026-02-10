import {
  minky,
  minkyRoot,
  Reform,
  RequiredValidator,
} from '@lotus/front-global/minky/core';
import { CommentSearchDTO } from '@ubs-platform/social-common';

@minkyRoot()
export class SearchForm implements CommentSearchDTO {
  @minky({
    hide: true,
  })
  entityGroup = '';

  //   @minky({
  //     hide: true,
  //   })
  //   mainEntityName?: string;

  //   mainEntityIdByOwner?: boolean;
  //   childEntityName?: string;
  //   childEntityId?: string;
  //   childOfCommentId?: string;
  @minky({
    label: 'İçerik içinde',
  })
  contentTextIn?: string;

  @minky({
    hide: true,
  })
  mainEntityId?: string;

  //   @minky({
  //     inputType: 'radios',
  //     label: 'mona.comments.contentType',
  //     validators: [new RequiredValidator()],
  //   })
  //   contentType: string = '';

  //   @minky({ inputType: 'text', label: 'mona.comments.extraNotes' })
  //   extraNotes: string = '';
}

export const searchFeeds = (reform: Reform) => {
  //   reform.registerFeeder(
  //     new SelectFeeder(typePath, () => {
  //       const pre = [
  //         { text: 'Cinsellik', value: 'SEXUALITY' },
  //         { text: 'Şiddet', value: 'VIOLENCE' },
  //         { text: 'Taciz ve ya zorbalama', value: 'ABUSEMENT_BULLYING' },
  //         {
  //           text: 'Nefret söylemi, terörizm ya da kötü niyetlilik',
  //           value: 'HATESPEECH_TERROISM_ILLWILL',
  //         },
  //         {
  //           text: 'Tehlikeli ve zarar verici aktiviteler',
  //           value: 'DANGERIOUS_ACTIVITIES',
  //         },
  //         { text: 'Yanlış bilgilendirme', value: 'WRONG_INFO' },
  //         { text: 'Spam ', value: 'SPAM' },
  //       ];
  //       const searchArr = search ? [{ text: 'Seçilmedi', value: '' }] : [];
  //       return Promise.resolve([...searchArr, ...pre]);
  //     })
  //   );
};
