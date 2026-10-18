import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Icon from 'components/common/Icon';
import LanguageSwitch from 'components/common/LanguageSwitch';
import SiteLink from 'components/common/SiteLink';
import { pages } from 'data/navigation';
import { cvUrl } from 'data/profile';
import useCopyLink from 'hooks/useCopyLink';

const SiteHeader = ({ t, language, setLanguage }) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const { copied, fallback, copyLink, reset } = useCopyLink(4000);
  const url = new URL(window.location.href);

  url.search = '';
  url.searchParams.set('lang', language);
  url.hash = '';
  url.pathname = '/';

  const profileUrl = url.href;

  return (
    <>
      <header className='site-masthead'>
        <div className='masthead-bar'>
          <SiteLink className='wordmark' to='/' aria-label={t('Rıza Gökhan Baykal home')}>
            Rıza Gökhan Baykal<span className='header-degree'>, MD</span>
          </SiteLink>
          <div className='masthead-actions'>
            <button
              className='menu-toggle'
              aria-expanded={menuOpen}
              aria-controls='primary-navigation'
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden='true'>{menuOpen ? '×' : '☰'}</span>
              {t(menuOpen ? 'Close menu' : 'Menu')}
            </button>
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
            <LanguageSwitch language={language} setLanguage={setLanguage} />
          </div>
        </div>
        <nav
          id='primary-navigation'
          className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
          aria-label={t('Main navigation')}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMenuOpen(false);
              document.querySelector('.menu-toggle')?.focus();
            }
          }}
        >
          {pages.map(([path, label]) => {
            const active =
              path === '/'
                ? pathname === '/'
                : pathname === path || pathname.startsWith(`${path}/`);

            return (
              <SiteLink
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {t(label)}
              </SiteLink>
            );
          })}
        </nav>
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
