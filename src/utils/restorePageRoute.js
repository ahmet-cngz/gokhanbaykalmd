// GitHub Pages redirects deep links through the root document via public/404.html.
const restorePageRoute = () => {
  const target = new URLSearchParams(window.location.search).get('__route');

  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return;
  }

  const url = new URL(target, window.location.origin);

  if (url.origin === window.location.origin) {
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
  }
};

export default restorePageRoute;
