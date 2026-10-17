import SectionHeading from 'components/common/SectionHeading';
import { career } from 'data/profile';

const Experience = ({ t }) => {
  return (
    <section id='experience' className='cv-section'>
      <SectionHeading
        number='01'
        eyebrow={t('CLINICAL & ACADEMIC PATH')}
        title={t('Experience & education')}
      />
      <div className='timeline'>
        {career.map(([date, role, institution, place], i) => (
          <article className='timeline-entry' key={date}>
            <div className='timeline-date'>
              {t(date)}
              {i === 0 && <span className='current-badge'>{t('CURRENT')}</span>}
            </div>
            <div className='timeline-content'>
              <h3>{t(role)}</h3>
              <p>{t(institution)}</p>
              <span className='muted'>{place}</span>
            </div>
          </article>
        ))}
      </div>
      <div className='education'>
        <span className='eyebrow'>{t('EDUCATION')}</span>
        <div>
          <span className='timeline-date'>2006 — 2013</span>
          <h3>{t('Doctor of Medicine')}</h3>
          <p>{t('Ankara University Faculty of Medicine, Türkiye')}</p>
          <span className='muted'>{t('GPA: 3.44 / 4.00')}</span>
        </div>
      </div>
    </section>
  );
};

export default Experience;
