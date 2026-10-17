import { Language } from 'constants/languages';
import { contentRoot, localArticle } from 'utils/patientContent';
import { articlePrefix, formatArticleDate } from 'utils/patientNavigation';

const ArticleCard = ({ article, language, categoryTitle, onOpen }) => {
  const tr = language === Language.TURKISH;
  const content = localArticle(article, language);
  const href = `${articlePrefix}${article.id}`;
  const open = (event) => {
    event.preventDefault();
    onOpen(article.id);
  };

  return (
    <article className={`advice-card${article.featured ? ' advice-card-featured' : ''}`}>
      {article.image && (
        <img
          className='advice-card-art'
          src={`${contentRoot}${article.image}`}
          alt=''
          aria-hidden='true'
          loading='lazy'
          decoding='async'
          onError={({ currentTarget }) => {
            currentTarget.hidden = true;
          }}
        />
      )}
      <div className='advice-card-top'>
        <span>{categoryTitle}</span>
        {article.featured && <span>{tr ? 'ÖNE ÇIKAN' : 'FEATURED'}</span>}
      </div>
      <h3 lang={content.language}>
        <a href={href} onClick={open}>
          {content.title}
        </a>
      </h3>
      <p lang={content.language}>{content.summary}</p>
      <div className='advice-card-footer'>
        <time dateTime={article.updatedAt}>{formatArticleDate(article.updatedAt, language)}</time>
        <a href={href} onClick={open} aria-label={`${tr ? 'Oku' : 'Read'}: ${content.title}`}>
          {tr ? 'Notu oku' : 'Read note'} <span aria-hidden='true'>↗</span>
        </a>
      </div>
    </article>
  );
};

export default ArticleCard;
