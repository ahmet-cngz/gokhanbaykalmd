import Icon from 'components/common/Icon';
import SiteLink from 'components/common/SiteLink';

const Overview = ({ t }) => {
  return (
    <section id='overview' className='overview'>
      <div className='profile-kicker'>
        <span className='status-dot' /> {t('PHYSICIAN & RESEARCHER')}{' '}
        <span className='edition'>{t('PATIENTS & RESEARCH')}</span>
      </div>
      <h1>
        <span>Rıza Gökhan</span>Baykal<span className='degree'>, MD</span>
        <span className='hero-period'>.</span>
      </h1>
      <p className='hero-specialty'>{t('Endocrinology & Metabolic Diseases')}</p>
      <p className='hero-description'>
        {t(
          'Patient information and academic work in endocrinology and metabolic diseases, together in one place.',
        )}
      </p>
      <div className='current-position'>
        <span className='current-label'>{t('CURRENT APPOINTMENT')}</span>
        <p>
          {t('Specialist in Endocrinology & Metabolic Diseases')}
          <br />
          <span>{t('Mardin Training and Research Hospital · Türkiye')}</span>
        </p>
      </div>
      <div className='hero-actions'>
        <SiteLink className='primary-button' to='/patient-advice'>
          {t('Patient recommendations')} <Icon name='arrow' />
        </SiteLink>
        <SiteLink className='inline-link' to='/academic-profile'>
          {t('Academic profile')} <span>↗</span>
        </SiteLink>
      </div>
    </section>
  );
};

export default Overview;
