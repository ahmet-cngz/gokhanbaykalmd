import SiteLink from 'components/common/SiteLink';
import { academicPages } from 'data/navigation';

const AcademicProfile = ({ t }) => {
  return (
    <>
      <div id='academic-profile' className='academic-introduction academic-page'>
        <SiteLink className='page-return' to='/'>
          ← {t('Back to home')}
        </SiteLink>
        <p className='eyebrow'>{t('GET TO KNOW YOUR DOCTOR')}</p>
        <h1>{t('Academic profile')}</h1>
        <p className='academic-description'>
          {t('Clinical training, research, and professional development.')}
        </p>
        <div className='stats'>
          <SiteLink to='/publications'>
            <strong>
              15<span> /</span>
            </strong>
            <span>{t('Publication entries')}</span>
          </SiteLink>
          <SiteLink to='/presentations'>
            <strong>
              29<span> /</span>
            </strong>
            <span>{t('Conference presentations')}</span>
          </SiteLink>
          <SiteLink to='/experience'>
            <strong>
              2013<span> /</span>
            </strong>
            <span>{t('Medical degree awarded')}</span>
          </SiteLink>
        </div>
        <div className='research-strip'>
          <span className='eyebrow'>{t('RESEARCH THEMES')}</span>
          <div>
            <span>{t('Thyroid disorders')}</span>
            <span>{t('Adrenal disease')}</span>
            <span>{t('Obesity & metabolism')}</span>
            <span>{t('Endocrine disruptors')}</span>
          </div>
        </div>
      </div>
      <div className='academic-page-links'>
        {academicPages.map(([path, label], index) => (
          <SiteLink to={path} key={path}>
            <span className='eyebrow'>{String(index + 1).padStart(2, '0')}</span>
            <h2>{t(label)}</h2>
            <span aria-hidden='true'>↗</span>
          </SiteLink>
        ))}
      </div>
    </>
  );
};

export default AcademicProfile;
