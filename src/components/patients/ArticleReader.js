import { useEffect, useRef } from "react";
import useCopyLink from "../../hooks/useCopyLink";
import { attachmentUrl, localArticle } from "../../utils/patientContent";
import { articleLink, formatArticleDate } from "../../utils/patientNavigation";
import ArticleBody from "./ArticleBody";

export default function ArticleReader({
  article,
  language,
  categoryTitle,
  onBack,
}) {
  const tr = language === "tr";
  const content = article && localArticle(article, language);
  const reader = useRef(null);
  const { copied, fallback, copyLink } = useCopyLink();
  const shareUrl = article && articleLink(article.id, language);

  useEffect(() => {
    reader.current?.focus({ preventScroll: true });
    reader.current?.scrollIntoView?.({ behavior: "instant", block: "start" });
  }, []);

  return (
    <article
      className="advice-reader"
      ref={reader}
      tabIndex={-1}
      aria-label={tr ? "Bilgilendirme notu" : "Information note"}
    >
      <button className="advice-back" onClick={onBack}>
        <span aria-hidden="true">←</span>{" "}
        {tr ? "Tüm öneriler" : "All recommendations"}
      </button>
      {!article ? (
        <div className="advice-state">
          <h3>{tr ? "Bu not bulunamadı." : "This note was not found."}</h3>
          <p>
            {tr
              ? "Not kaldırılmış veya henüz yayımlanmamış olabilir."
              : "It may have been removed or may not be published yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="advice-article-meta">
            <span>{categoryTitle}</span>
            <span>
              {tr ? "Güncelleme" : "Updated"} ·{" "}
              {formatArticleDate(article.updatedAt, language)}
            </span>
          </div>
          {content.language !== language && (
            <p className="translation-note">
              {tr
                ? "Bu not Türkçe olarak sunulmaktadır."
                : "This note is available in Turkish."}
            </p>
          )}
          <div lang={content.language}>
            <h3 className="advice-article-title">{content.title}</h3>
            <p className="advice-article-summary">{content.summary}</p>
            <ArticleBody blocks={content.body} />
          </div>
          {!!article.attachments?.length && (
            <div className="advice-attachments">
              <h4>{tr ? "Ek dosyalar" : "Attached files"}</h4>
              {article.attachments.map((file) => (
                <a
                  href={attachmentUrl(file.path)}
                  key={file.path}
                  target="_blank"
                  rel="noreferrer"
                >
                  ↓ {file.label[language] || file.label.tr}
                </a>
              ))}
            </div>
          )}
          <div className="advice-reader-footer">
            <button
              className="primary-button"
              onClick={() => copyLink(shareUrl)}
            >
              {tr ? "Bağlantıyı kopyala" : "Copy link"}{" "}
              <span aria-hidden="true">↗</span>
            </button>
            <span role="status">
              {copied && (tr ? "Bağlantı kopyalandı" : "Link copied")}
            </span>
          </div>
          {fallback && (
            <label className="advice-copy-fallback">
              {tr
                ? "Paylaşmak için bağlantıyı kopyalayın"
                : "Copy this link to share"}
              <input
                readOnly
                value={shareUrl}
                onFocus={(event) => event.target.select()}
              />
            </label>
          )}
        </>
      )}
    </article>
  );
}
