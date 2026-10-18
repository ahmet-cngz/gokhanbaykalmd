import SiteLink from 'components/common/SiteLink';

const SiteFooter = ({ t }) => {
  return (
    <footer>
      <span>Rıza Gökhan Baykal, MD</span>
      <SiteLink to='/'>{t('Overview')}</SiteLink>
    </footer>
  );
};

export default SiteFooter;
