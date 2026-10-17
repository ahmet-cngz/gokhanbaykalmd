import Affiliations from 'components/profile/Affiliations';
import Experience from 'components/profile/Experience';
import Presentations from 'components/profile/Presentations';
import ProfessionalDevelopment from 'components/profile/ProfessionalDevelopment';
import Publications from 'components/profile/Publications';

const AcademicProfile = ({ t, language }) => {
  return (
    <>
      <div id='academic-profile' className='academic-introduction'>
        <p className='eyebrow'>{t('GET TO KNOW YOUR DOCTOR')}</p>
        <h2>{t('Academic profile')}</h2>
        <p className='academic-description'>
          {t('Clinical training, research, and professional development.')}
        </p>
        <div className='stats'>
          <a href='#publications'>
            <strong>
              15<span> /</span>
            </strong>
            <span>{t('Publication entries')}</span>
          </a>
          <a href='#presentations'>
            <strong>
              29<span> /</span>
            </strong>
            <span>{t('Conference presentations')}</span>
          </a>
          <a href='#experience'>
            <strong>
              2013<span> /</span>
            </strong>
            <span>{t('Medical degree awarded')}</span>
          </a>
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
      <Experience t={t} />
      <Publications t={t} language={language} />
      <Presentations t={t} />
      <ProfessionalDevelopment t={t} />
      <Affiliations t={t} />
    </>
  );
};

export default AcademicProfile;
