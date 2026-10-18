import SiteLink from 'components/common/SiteLink';

const PageFrame = ({ t, children }) => (
  <div className='content-page'>
    <SiteLink className='page-return' to='/academic-profile'>
      <span aria-hidden='true'>←</span> {t('Academic profile')}
    </SiteLink>
    {children}
  </div>
);

export default PageFrame;
