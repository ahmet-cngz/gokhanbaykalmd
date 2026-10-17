import { useEffect, useState } from 'react';

import { sections } from 'data/navigation';

const useSectionNavigation = () => {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    // React mounts after the browser's first anchor lookup on a shared link.
    const scrollToSection = () => {
      const id = window.location.hash.slice(1);

      if (!id || id.includes('/')) {
        return;
      }

      const section = document.getElementById(id);

      section?.scrollIntoView?.({ behavior: 'instant', block: 'start' });
    };

    scrollToSection();
    window.addEventListener('hashchange', scrollToSection);

    return () => window.removeEventListener('hashchange', scrollToSection);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: '-12% 0px -65% 0px' },
    );

    sections.forEach(([id]) => {
      const section = document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  return { active, setActive };
};

export default useSectionNavigation;
