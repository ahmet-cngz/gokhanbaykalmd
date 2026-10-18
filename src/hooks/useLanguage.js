import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Language, SUPPORTED_LANGUAGES } from 'constants/languages';
import { initialLanguage, translate } from 'utils/i18n';

const useLanguage = () => {
  const [savedLanguage] = useState(initialLanguage);
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const requestedLanguage = new URLSearchParams(search).get('lang');
  const language = SUPPORTED_LANGUAGES.includes(requestedLanguage)
    ? requestedLanguage
    : savedLanguage;
  const setLanguage = (value) => {
    const params = new URLSearchParams(search);

    params.set('lang', value);
    navigate({ pathname, search: `?${params}`, hash }, { replace: true });
  };

  useEffect(() => {
    if (requestedLanguage !== language) {
      const params = new URLSearchParams(search);

      params.set('lang', language);
      navigate({ pathname, search: `?${params}`, hash }, { replace: true });
    }
  }, [language, requestedLanguage, navigate, pathname, search, hash]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === Language.TURKISH
        ? 'Rıza Gökhan Baykal, MD · Hasta Bilgilendirme ve Akademik Profil'
        : 'Rıza Gökhan Baykal, MD · Patient Information & Academic Profile';

    const description =
      language === Language.TURKISH
        ? 'Dr. Rıza Gökhan Baykal. Hastalara öneriler, endokrinoloji ve metabolizma hastalıkları hakkında bilgilendirme notları ve akademik çalışmalar.'
        : 'Rıza Gökhan Baykal, MD. Patient information notes, endocrinology and metabolic diseases, clinical experience, and academic publications.';

    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);

    try {
      localStorage.setItem('cv-language', language);
    } catch {
      /* Selection still works when storage is unavailable. */
    }
  }, [language]);

  return {
    language,
    setLanguage,
    t: (text) => translate(language, text),
  };
};

export default useLanguage;
