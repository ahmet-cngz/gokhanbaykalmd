import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import 'styles/app.css';
import PageFrame from 'components/layout/PageFrame';
import SiteFooter from 'components/layout/SiteFooter';
import SiteHeader from 'components/layout/SiteHeader';
import PatientAdvice from 'components/patients/PatientAdvice';
import AcademicProfile from 'components/profile/AcademicProfile';
import Affiliations from 'components/profile/Affiliations';
import CvDownload from 'components/profile/CvDownload';
import Experience from 'components/profile/Experience';
import Overview from 'components/profile/Overview';
import Presentations from 'components/profile/Presentations';
import Publications from 'components/profile/Publications';
import SitePaths from 'components/profile/SitePaths';
import useLanguage from 'hooks/useLanguage';
import usePageNavigation from 'hooks/usePageNavigation';
import 'styles/navigation.css';
import 'styles/appearance.css';

const AppContent = () => {
  const { language, setLanguage, t } = useLanguage();

  usePageNavigation();

  const { pathname, search } = useLocation();

  return (
    <>
      <a className='skip-link' href='#main'>
        {t('Skip to content')}
      </a>
      <SiteHeader t={t} language={language} setLanguage={setLanguage} />
      <div className='site-content'>
        <main
          id='main'
          className='site-main'
          data-page={pathname.split('/')[1] || 'overview'}
          tabIndex={-1}
        >
          <Routes>
            <Route
              path='/'
              element={
                <>
                  <Overview t={t} />
                  <SitePaths t={t} />
                  <CvDownload t={t} />
                </>
              }
            />
            <Route path='/academic-profile' element={<AcademicProfile t={t} />} />
            <Route
              path='/development'
              element={<Navigate to={{ pathname: '/academic-profile', search }} replace />}
            />
            {[
              ['/experience', <Experience t={t} />],
              ['/publications', <Publications t={t} language={language} />],
              ['/presentations', <Presentations t={t} />],
              ['/affiliations', <Affiliations t={t} />],
            ].map(([path, page]) => (
              <Route key={path} path={path} element={<PageFrame t={t}>{page}</PageFrame>} />
            ))}
            <Route path='/patient-advice' element={<PatientAdvice language={language} />}>
              <Route path=':articleId' element={null} />
            </Route>
            <Route
              path='*'
              element={
                <section className='route-not-found'>
                  <p className='eyebrow'>404</p>
                  <h1>{t('Page not found')}</h1>
                  <Link className='primary-button' to={{ pathname: '/', search }}>
                    ← {t('Back to home')}
                  </Link>
                </section>
              }
            />
          </Routes>
          <SiteFooter t={t} />
        </main>
      </div>
    </>
  );
};

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppContent />
  </BrowserRouter>
);

export default App;
