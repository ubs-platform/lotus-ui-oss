import {
  minky,
  minkyRoot,
  Reform,
  RequiredValidator,
} from '@lotus/front-global/minky/core';

@minkyRoot()
export class FlagForm {
  @minky({
    inputType: 'radios',
    label: 'mona.comments.contentType',
    validators: [new RequiredValidator()],
    selectItems: (env) => {
      return [
        ...(env.parameters.get("search") ? [{text: "Seçilmedi", value: ""}] : []),
        { text: 'Cinsellik', value: 'SEXUALITY' },
        { text: 'Şiddet', value: 'VIOLENCE' },
        { text: 'Taciz ve ya zorbalama', value: 'ABUSEMENT_BULLYING' },
        {
          text: 'Nefret söylemi, terörizm ya da kötü niyetlilik',
          value: 'HATESPEECH_TERROISM_ILLWILL',
        },
        {
          text: 'Tehlikeli ve zarar verici aktiviteler',
          value: 'DANGERIOUS_ACTIVITIES',
        },
        { text: 'Yanlış bilgilendirme', value: 'WRONG_INFO' },
        { text: 'Spam ', value: 'SPAM' },
      ];
    },
  })
  contentType: string = '';

  @minky({ inputType: 'text', label: 'mona.comments.extraNotes' })
  extraNotes: string = '';
}

