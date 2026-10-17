export const articlePrefix = "#patient-advice/";

export function articleIdFromHash() {
  return window.location.hash.startsWith(articlePrefix)
    ? window.location.hash.slice(articlePrefix.length)
    : "";
}

export function articleLink(id, language) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", language);
  url.hash = `${articlePrefix}${id}`;
  return url.href;
}

export function formatArticleDate(value, language) {
  return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}
