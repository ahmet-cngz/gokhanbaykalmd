import Icon from 'components/common/Icon';
import { cvUrl } from 'data/profile';

const CvDownload = ({ t }) => {
  return (
    <div className='closing'>
      <p className='eyebrow'>{t('THE COMPLETE ACADEMIC RECORD')}</p>
      <h2>{t('Take the CV with you.')}</h2>
      <p>{t('Download the original curriculum vitae for your records.')}</p>
      <a className='primary-button' href={cvUrl} download>
        {t('Download curriculum vitae')} <Icon name='download' />
      </a>
    </div>
  );
};

export default CvDownload;
