import { useEffect, useRef, useState } from 'react';

import ArticleCard from 'components/patients/ArticleCard';
import ArticleReader from 'components/patients/ArticleReader';
import { Language } from 'constants/languages';
import usePatientContent from 'hooks/usePatientContent';
import { filterArticles } from 'utils/patientContent';
import { articleIdFromHash, articlePrefix } from 'utils/patientNavigation';
import 'styles/patientAdvice.css';

const PatientAdvice = ({ language }) => {
  const tr = language === Language.TURKISH;
  const { data, status, retry } = usePatientContent();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(articleIdFromHash);
  const listHeading = useRef(null);

  useEffect(() => {
    const update = () => {
      setSelected(articleIdFromHash());
    };

    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);

    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  const navigate = (id) => {
    const hash = id ? `${articlePrefix}${id}` : '#patient-advice';

    window.history.pushState(null, '', hash);
    setSelected(id);

    if (!id) {
      listHeading.current?.focus({
        preventScroll: true,
      });
      listHeading.current?.scrollIntoView?.({
        behavior: 'instant',
        block: 'start',
      });
    }
  };

  const categoryTitle = (id) => {
    const item = data.categories.find((item) => item.id === id);

    return item?.title[language] || item?.title[Language.TURKISH] || '';
  };

  const article = data?.articles.find((item) => item.id === selected);
  const results = filterArticles(data?.articles || [], {
    language,
    category,
    query,
  });

  return (
    <section id='patient-advice' className='patient-section' aria-labelledby='advice-title'>
      <div className='patient-section-heading'>
        <p className='eyebrow'>{tr ? 'HASTA BİLGİLENDİRME' : 'PATIENT INFORMATION'}</p>
        <div className='advice-title-row'>
          <h2 id='advice-title' ref={listHeading} tabIndex={-1}>
            {tr ? 'Hastalara Öneriler' : 'Patient recommendations'}
          </h2>
          <span className='advice-symbol' aria-hidden='true'>
            ↗
          </span>
        </div>
        <p>
          {tr
            ? 'Bilgilendirme notlarını keşfedin. Konuya göre arayın, okuyun ve ihtiyaç duyduğunuzda tekrar ulaşmak için kaydedin.'
            : 'Explore information notes. Browse by topic, read at your own pace, and save useful notes to revisit later.'}
        </p>
      </div>

      {status === 'loading' && (
        <p className='advice-state' role='status'>
          {tr ? 'Bilgilendirme notları yükleniyor…' : 'Loading information notes…'}
        </p>
      )}
      {status === 'error' && (
        <div className='advice-state' role='alert'>
          <h3>{tr ? 'Notlar şu anda yüklenemiyor.' : 'The notes could not be loaded.'}</h3>
          <p>{tr ? 'Lütfen tekrar deneyin.' : 'Please try again.'}</p>
          <button className='advice-outline-button' onClick={retry}>
            {tr ? 'Tekrar dene' : 'Try again'}
          </button>
        </div>
      )}

      {status === 'ready' && selected && (
        <ArticleReader
          key={selected}
          article={article}
          language={language}
          categoryTitle={article ? categoryTitle(article.category) : ''}
          onBack={() => navigate('')}
        />
      )}

      {status === 'ready' && !selected && (
        <>
          <div className='advice-tools'>
            <label className='advice-search'>
              <span aria-hidden='true'>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={tr ? 'Önerilerde ara' : 'Search recommendations'}
                placeholder={tr ? 'Bir konu veya kelime arayın…' : 'Search for a topic or keyword…'}
              />
            </label>
            <span className='advice-result-count' role='status'>
              {tr
                ? `${results.length} bilgilendirme notu`
                : `${results.length} information ${results.length === 1 ? 'note' : 'notes'}`}
            </span>
          </div>
          <div
            className='advice-categories'
            role='group'
            aria-label={tr ? 'Konu seçimi' : 'Choose a topic'}
          >
            <button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
              {tr ? 'Tüm konular' : 'All topics'}
            </button>
            {data.categories.map((item) => (
              <button
                key={item.id}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.title[language] || item.title[Language.TURKISH]}
              </button>
            ))}
          </div>
          <div className='advice-grid'>
            {results.map((item) => (
              <ArticleCard
                key={item.id}
                article={item}
                language={language}
                categoryTitle={categoryTitle(item.category)}
                onOpen={navigate}
              />
            ))}
          </div>
          {results.some((item) => item.image) && (
            <p className='advice-image-credit'>
              {tr ? 'Tıbbi görseller: ' : 'Medical illustrations: '}
              <a href='https://smart.servier.com/' target='_blank' rel='noreferrer'>
                Servier Medical Art
              </a>
              {' · '}
              <a
                href='https://creativecommons.org/licenses/by/4.0/'
                target='_blank'
                rel='noreferrer'
              >
                CC BY 4.0
              </a>
              {tr ? ' · Renk ve saydamlık uyarlandı.' : ' · Color and opacity adapted.'}
            </p>
          )}
          {!results.length && (
            <div className='advice-state'>
              <h3>{tr ? 'Bu konuda henüz not bulunmuyor.' : 'No notes found for this topic.'}</h3>
              <p>
                {tr
                  ? 'Farklı bir konu seçebilir veya aramanızı değiştirebilirsiniz.'
                  : 'Choose another topic or try a different search.'}
              </p>
              <button
                className='advice-outline-button'
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                {tr ? 'Tüm notları göster' : 'Show all notes'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default PatientAdvice;
