import SiteLink from 'components/common/SiteLink';
import { Language } from 'constants/languages';
import { contentRoot, localArticle } from 'utils/patientContent';
import { articlePath, formatArticleDate } from 'utils/patientNavigation';

const ArticleCard = ({ article, language, categoryTitle }) => {
  const tr = language === Language.TURKISH;
  const content = localArticle(article, language);
  const href = articlePath(article.id);

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
        <SiteLink to={href}>{content.title}</SiteLink>
      </h3>
      <p lang={content.language}>{content.summary}</p>
      <div className='advice-card-footer'>
        <time dateTime={article.updatedAt}>{formatArticleDate(article.updatedAt, language)}</time>
        <SiteLink to={href} aria-label={`${tr ? 'Oku' : 'Read'}: ${content.title}`}>
          {tr ? 'Notu oku' : 'Read note'} <span aria-hidden='true'>↗</span>
        </SiteLink>
      </div>
    </article>
  );
};

export default ArticleCard;
