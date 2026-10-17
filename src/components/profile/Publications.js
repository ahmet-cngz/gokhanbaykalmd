import { useState } from 'react';

import Icon from 'components/common/Icon';
import SectionHeading from 'components/common/SectionHeading';
import { Language } from 'constants/languages';
import cvData from 'data/cv.json';

const { publications } = cvData;
const Publications = ({ t, language }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All publications');
  const [year, setYear] = useState('All years');
  const [expanded, setExpanded] = useState(false);
  const filtered = publications.filter(
    (p) =>
      `${p.title} ${p.citation}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) &&
      (type === 'All publications' || p.type === type) &&
      (year === 'All years' || String(p.year) === year),
  );
  const visiblePublications = expanded ? filtered : filtered.slice(0, 5);

  return (
    <section id='publications' className='cv-section'>
      <SectionHeading number='02' eyebrow={t('RESEARCH & SCHOLARSHIP')} title={t('Publications')}>
        <span className='section-count'>{t('15 entries')}</span>
      </SectionHeading>
      <div className='publication-controls'>
        <label className='search-field'>
          <Icon name='search' />
          <input
            aria-label={t('Search publications')}
            placeholder={t('Search by title, author, or keyword…')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExpanded(false);
            }}
          />
        </label>
        <label className='sr-only' htmlFor='pub-year'>
          {t('Publication year')}
        </label>
        <select
          id='pub-year'
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setExpanded(false);
          }}
        >
          <option value='All years'>{t('All years')}</option>
          <option>2026</option>
          <option>2025</option>
          <option>2022</option>
        </select>
      </div>
      <div className='publication-tabs' aria-label={t('Filter publication type')}>
        {['All publications', 'Journal article', 'Conference abstract'].map((filter) => (
          <button
            key={filter}
            aria-pressed={type === filter}
            className={type === filter ? 'selected' : ''}
            onClick={() => {
              setType(filter);
              setExpanded(false);
            }}
          >
            {t(
              filter === 'Journal article'
                ? 'Journal articles'
                : filter === 'Conference abstract'
                  ? 'Conference abstracts'
                  : filter,
            )}
            <span>
              {filter === 'All publications'
                ? 15
                : publications.filter((p) => p.type === filter).length}
            </span>
          </button>
        ))}
      </div>
      <p className='result-count' role='status'>
        {language === Language.TURKISH
          ? `${filtered.length} yayından ${visiblePublications.length} kayıt gösteriliyor`
          : `Showing ${visiblePublications.length} of ${filtered.length} publications`}
      </p>
      <div className='publication-list'>
        {visiblePublications.map((p) => (
          <article className='publication' key={p.id}>
            <span className='pub-index'>{String(p.id).padStart(2, '0')}</span>
            <div>
              <div className='pub-meta'>
                <span>{p.year}</span>
                <span>{t(p.type)}</span>
              </div>
              <h3>
                <a href={`https://doi.org/${p.doi}`} target='_blank' rel='noreferrer'>
                  {p.title}
                  <Icon name='arrow' />
                </a>
              </h3>
              <p className='journal'>{p.journal}</p>
              <details className='citation'>
                <summary>
                  {t('Full citation')} <Icon name='chevron' />
                </summary>
                <p>{p.citation}</p>
              </details>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className='empty-state'>
          <h3>{t('No publications found')}</h3>
          <p>{t('Try another keyword, year, or publication type.')}</p>
          <button
            className='inline-link'
            onClick={() => {
              setQuery('');
              setType('All publications');
              setYear('All years');
            }}
          >
            {t('Clear filters')}
          </button>
        </div>
      )}
      {filtered.length > 5 && (
        <button className='show-more' onClick={() => setExpanded(!expanded)}>
          {expanded
            ? t('Show fewer publications')
            : language === Language.TURKISH
              ? `${filtered.length} yayının tümünü göster`
              : `View all ${filtered.length} publications`}
          <Icon
            name='chevron'
            style={{
              transform: expanded ? 'rotate(180deg)' : undefined,
            }}
          />
        </button>
      )}
      <div className='book-chapter'>
        <span className='eyebrow'>{t('BOOK CHAPTER · 2023')}</span>
        <h3>The nervous system in the pathophysiology of diabetes and cardiovascular disease</h3>
        <p>
          Baykal G.R. In: Şener YZ, Özdede M, Güven AT, editors.{' '}
          <em>Diyabet ve Kardiyovasküler Hastalıklar (Diabetes and Cardiovascular Diseases).</em>{' '}
          Akademisyen Publishing House.
        </p>
      </div>
    </section>
  );
};

export default Publications;
