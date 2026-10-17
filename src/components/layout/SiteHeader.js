import Icon from 'components/common/Icon';
import LanguageSwitch from 'components/common/LanguageSwitch';
import { cvUrl } from 'data/profile';
import useCopyLink from 'hooks/useCopyLink';

const SiteHeader = ({ t, language, setLanguage }) => {
  const { copied, fallback, copyLink, reset } = useCopyLink(4000);
  const url = new URL(window.location.href);

  url.searchParams.set('lang', language);
  url.hash = '';

  const profileUrl = url.href;

  return (
    <>
      <header className='site-header'>
        <a className='wordmark' href='#overview' aria-label={t('Rıza Gökhan Baykal home')}>
          Rıza Gökhan Baykal<span className='header-degree'>, MD</span>
        </a>
        <span className='header-caption'>{t('PATIENT INFORMATION & ACADEMIC PROFILE')}</span>
        <div className='header-actions'>
          <LanguageSwitch language={language} setLanguage={setLanguage} />
          <button
            className='text-button'
            aria-label={t('Share profile')}
            onClick={() => copyLink(profileUrl)}
          >
            <Icon name='share' />
            <span>{t('Share profile')}</span>
          </button>
          <a className='download-button' href={cvUrl} download>
            <Icon name='download' />
            <span>
              {t('Download CV')} <small>DOCX</small>
            </span>
          </a>
        </div>
      </header>
      {copied && (
        <div className='toast' role='status'>
          {t('Profile link copied to clipboard')}
        </div>
      )}
      {fallback && (
        <div className='share-fallback'>
          <label htmlFor='share-link'>{t('Copy this profile link')}</label>
          <input
            id='share-link'
            readOnly
            value={profileUrl}
            onFocus={(event) => event.target.select()}
          />
          <button onClick={reset}>{t('Close')}</button>
        </div>
      )}
    </>
  );
};

export default SiteHeader;
