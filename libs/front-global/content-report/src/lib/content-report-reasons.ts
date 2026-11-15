import {
  ContentReportEntityType,
  ContentReportReason,
} from './content-report.models';

const INAPPROPRIATE: ContentReportReason[] = [
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

export const DEFAULT_REASONS: Record<
  ContentReportEntityType,
  ContentReportReason[]
> = {
  COMMENT: INAPPROPRIATE,
  BOOK: [
    ...INAPPROPRIATE,
    { text: 'Telif hakkı ihlali', value: 'COPYRIGHT' },
  ],
  QUESTION: [
    { text: 'Cevap yanlış', value: 'WRONG_ANSWER' },
    { text: 'Soru metninde hata var', value: 'QUESTION_TEXT_ERROR' },
    { text: 'Yazım / dil hatası', value: 'TYPO' },
    { text: 'Görsel ya da medya sorunu', value: 'MEDIA_PROBLEM' },
    { text: 'Uygunsuz içerik', value: 'INAPPROPRIATE' },
    { text: 'Diğer', value: 'OTHER' },
  ],
};
