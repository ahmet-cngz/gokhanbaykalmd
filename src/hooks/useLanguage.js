import { useEffect, useState } from "react";
import { initialLanguage, translate } from "../utils/i18n";

export default function useLanguage() {
  const [language, setLanguage] = useState(initialLanguage);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "tr"
        ? "Rıza Gökhan Baykal, MD · Hasta Bilgilendirme ve Akademik Profil"
        : "Rıza Gökhan Baykal, MD · Patient Information & Academic Profile";
    const description =
      language === "tr"
        ? "Dr. Rıza Gökhan Baykal. Hastalara öneriler, endokrinoloji ve metabolizma hastalıkları hakkında bilgilendirme notları ve akademik çalışmalar."
        : "Rıza Gökhan Baykal, MD. Patient information notes, endocrinology and metabolic diseases, clinical experience, and academic publications.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    try {
      localStorage.setItem("cv-language", language);
    } catch {
      /* Selection still works when storage is unavailable. */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState(null, "", url);
  }, [language]);
  return { language, setLanguage, t: (text) => translate(language, text) };
}
