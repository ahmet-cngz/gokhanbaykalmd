export const Language = Object.freeze({
  ENGLISH: 'en',
  TURKISH: 'tr',
});

export const DEFAULT_LANGUAGE = Language.ENGLISH;

export const SUPPORTED_LANGUAGES = Object.freeze(Object.values(Language));

export const LANGUAGE_LOCALES = Object.freeze({
  [Language.ENGLISH]: 'en-GB',
  [Language.TURKISH]: 'tr-TR',
});
