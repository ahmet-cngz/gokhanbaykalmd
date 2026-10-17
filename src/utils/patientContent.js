export const contentRoot = `${process.env.PUBLIC_URL}/content/`;

export function localArticle(article, language) {
  return article[language]
    ? { ...article[language], language }
    : { ...article.tr, language: "tr" };
}

export function attachmentUrl(path) {
  if (typeof path !== "string" || !path.startsWith("files/")) return null;
  const base = new URL(contentRoot, window.location.href);
  const resolved = new URL(path, base);
  return resolved.origin === base.origin &&
    resolved.pathname.startsWith(`${base.pathname}files/`)
    ? resolved.href
    : null;
}

export function validateContent(data) {
  if (
    data?.version !== 1 ||
    !Array.isArray(data.categories) ||
    !Array.isArray(data.articles)
  )
    throw new Error("Invalid patient content format");
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const categoryIds = new Set();
  for (const category of data.categories) {
    if (
      !slug.test(category.id) ||
      categoryIds.has(category.id) ||
      !category.title?.tr?.trim()
    )
      throw new Error("Invalid category");
    categoryIds.add(category.id);
  }
  const ids = new Set();
  for (const article of data.articles) {
    if (
      !slug.test(article.id) ||
      ids.has(article.id) ||
      !["draft", "published"].includes(article.status) ||
      !categoryIds.has(article.category)
    )
      throw new Error("Invalid article");
    ids.add(article.id);
    if (article.status === "draft") continue;
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(article.updatedAt) ||
      Number.isNaN(Date.parse(article.updatedAt)) ||
      new Date(article.updatedAt).toISOString().slice(0, 10) !==
        article.updatedAt
    )
      throw new Error("Invalid article date");
    for (const language of ["tr", "en"]) {
      const content = article[language];
      if (language === "en" && !content) continue;
      if (
        typeof content?.title !== "string" ||
        !content.title.trim() ||
        typeof content.summary !== "string" ||
        !content.summary.trim() ||
        !Array.isArray(content.body) ||
        !content.body.length
      )
        throw new Error("Incomplete article");
      for (const block of content.body) {
        if (!["paragraph", "heading", "list", "table"].includes(block.type))
          throw new Error("Unsupported block type");
        if (block.type === "table") {
          if (
            !Array.isArray(block.headers) ||
            !block.headers.length ||
            !Array.isArray(block.rows) ||
            !block.rows.length ||
            block.headers.some(
              (value) => typeof value !== "string" || !value.trim(),
            ) ||
            block.rows.some(
              (row) =>
                !Array.isArray(row) ||
                row.length !== block.headers.length ||
                row.some((value) => typeof value !== "string" || !value.trim()),
            )
          )
            throw new Error("Invalid article table");
        } else if (
          block.type === "list"
            ? !Array.isArray(block.items) ||
              !block.items.length ||
              block.items.some(
                (item) => typeof item !== "string" || !item.trim(),
              )
            : typeof block.text !== "string" || !block.text.trim()
        )
          throw new Error("Invalid article block");
      }
    }
    if (
      article.keywords &&
      (!Array.isArray(article.keywords) ||
        article.keywords.some((word) => typeof word !== "string"))
    )
      throw new Error("Invalid keywords");
    if (
      article.attachments &&
      (!Array.isArray(article.attachments) ||
        article.attachments.some(
          (file) => !file.label?.tr || !attachmentUrl(file.path),
        ))
    )
      throw new Error("Invalid attachment");
  }
  return {
    categories: data.categories,
    articles: data.articles
      .filter((article) => article.status === "published")
      .sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          b.updatedAt.localeCompare(a.updatedAt),
      ),
  };
}

function normalizeSearch(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i");
}

function blockText(block) {
  if (block.type === "table")
    return [...block.headers, ...block.rows.flat()].join(" ");
  return block.text || block.items.join(" ");
}

export function filterArticles(articles, { language, category, query }) {
  const search = normalizeSearch(query);
  return articles.filter((article) => {
    const content = localArticle(article, language);
    const searchableText = [
      content.title,
      content.summary,
      ...(article.keywords || []),
      ...content.body.map(blockText),
    ].join(" ");
    return (
      (category === "all" || article.category === category) &&
      normalizeSearch(searchableText).includes(search)
    );
  });
}
