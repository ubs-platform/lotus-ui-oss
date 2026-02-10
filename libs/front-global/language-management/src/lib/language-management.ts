export class LanguageManagement {
  public static readonly Languages = [
    { localeCode: 'tr-tr', name: 'language.tr-tr', flagEmoji: '🇹🇷' },
    { localeCode: 'en-us', name: 'language.en-us', flagEmoji: '🇺🇸' },
  ];

  public static LanguagesSelect = LanguageManagement.Languages.map((a) => ({
    text: a.name,
    value: a.localeCode,
  }));
}
