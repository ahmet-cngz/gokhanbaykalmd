import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { pages } from 'data/navigation';

const usePageNavigation = () => {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Keep links from the former single-page site working.
    const id = hash.slice(1);
    const legacyPath =
      id === 'overview' ? '/' : id === 'development' ? '/academic-profile' : `/${id}`;
    const legacy =
      pathname === '/' &&
      (pages.some(([path]) => path === legacyPath) ||
        id === 'academic-profile' ||
        id === 'development' ||
        id.startsWith('patient-advice/'));

    if (id && legacy) {
      navigate({ pathname: legacyPath, search }, { replace: true });
    }
  }, [pathname, hash, navigate, search]);

  useEffect(() => {
    const main = document.getElementById('main');

    main?.scrollIntoView?.({ behavior: 'instant', block: 'start' });
    main?.focus({ preventScroll: true });

    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const entrance = main?.animate?.(
        [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
      );

      return () => entrance?.cancel();
    }
  }, [pathname]);
};

export default usePageNavigation;
