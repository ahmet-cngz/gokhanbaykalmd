import { LANGUAGE_LOCALES } from 'constants/languages';

export const articlePath = (id) => `/patient-advice/${encodeURIComponent(id)}`;

export const articleLink = (id, language) => {
  const url = new URL(articlePath(id), window.location.origin);

  url.searchParams.set('lang', language);

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
