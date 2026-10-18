import { Link, useLocation } from 'react-router-dom';

const SiteLink = ({ to, ...props }) => {
  const { search: currentSearch } = useLocation();
  const params = new URLSearchParams(currentSearch);

  // Patient filters belong to the list and reader, not unrelated profile pages.
  if (!to.startsWith('/patient-advice')) {
    params.delete('q');
    params.delete('category');
  }

  const search = params.toString() ? `?${params}` : '';
  const [pathname, hash] = to.split('#');

  return (
    <Link to={{ pathname: pathname || '/', search, hash: hash ? `#${hash}` : '' }} {...props} />
  );
};

export default SiteLink;
