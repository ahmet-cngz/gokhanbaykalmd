import 'styles/app.css';
import Sidebar from 'components/layout/Sidebar';
import SiteFooter from 'components/layout/SiteFooter';
import SiteHeader from 'components/layout/SiteHeader';
import PatientAdvice from 'components/patients/PatientAdvice';
import AcademicProfile from 'components/profile/AcademicProfile';
import CvDownload from 'components/profile/CvDownload';
import Overview from 'components/profile/Overview';
import SitePaths from 'components/profile/SitePaths';
import useLanguage from 'hooks/useLanguage';
import useSectionNavigation from 'hooks/useSectionNavigation';

const App = () => {
  const { language, setLanguage, t } = useLanguage();
  const { active, setActive } = useSectionNavigation();

  return (
    <>
      <a className='skip-link' href='#main'>
        {t('Skip to content')}
      </a>
      <SiteHeader t={t} language={language} setLanguage={setLanguage} />
      <div className='page-layout'>
        <Sidebar t={t} active={active} setActive={setActive} />
        <main id='main'>
          <Overview t={t} />
          <SitePaths t={t} />
          <PatientAdvice language={language} />
          <AcademicProfile t={t} language={language} />
          <CvDownload t={t} />
          <SiteFooter t={t} />
        </main>
      </div>
    </>
  );
};

export default App;
