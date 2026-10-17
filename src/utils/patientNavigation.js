import { LANGUAGE_LOCALES } from 'constants/languages';

export const articlePrefix = '#patient-advice/';

export const articleIdFromHash = () => {
  return window.location.hash.startsWith(articlePrefix)
    ? window.location.hash.slice(articlePrefix.length)
    : '';
};

export const articleLink = (id, language) => {
  const url = new URL(window.location.href);

  url.searchParams.set('lang', language);
  url.hash = `${articlePrefix}${id}`;

  return url.href;
};

export const formatArticleDate = (value, language) => {
  return new Intl.DateTimeFormat(LANGUAGE_LOCALES[language], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
};
