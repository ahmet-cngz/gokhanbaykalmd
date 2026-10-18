import '@testing-library/jest-dom';

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import App from 'App';
import restorePageRoute from 'utils/restorePageRoute';

const content = require('../../public/content/patient-tips.json');

const travelHistory = async (direction) => {
  await act(async () => {
    await new Promise((resolve) => {
      window.addEventListener('popstate', resolve, { once: true });
      window.history[direction]();
    });
  });
};

beforeEach(() => {
  window.history.replaceState(null, '', '/?lang=en');
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => content });
  window.IntersectionObserver = jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test('separates home, recommendations, and notes while retaining filters across back and forward', async () => {
  render(<App />);
  expect(fetch).not.toHaveBeenCalled();

  const nav = screen.getByRole('navigation', { name: 'Main navigation' });

  fireEvent.click(within(nav).getByRole('link', { name: /Patient recommendations/ }));
  expect(window.location.pathname).toBe('/patient-advice');
  expect(screen.queryByRole('heading', { name: 'Experience & education' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Back to home/ })).toHaveAttribute('href', '/?lang=en');
  await screen.findByRole('link', { name: 'Thyroid nodules' });
  fireEvent.click(screen.getByRole('button', { name: 'Thyroid' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Search recommendations' }), {
    target: { value: 'nodule' },
  });
  fireEvent.click(screen.getByRole('link', { name: 'Thyroid nodules' }));
  expect(
    await screen.findByRole('heading', { name: 'Thyroid nodules', level: 1 }),
  ).toBeInTheDocument();
  expect(window.location.pathname).toBe('/patient-advice/tiroid-nodulu');
  expect(screen.queryByRole('textbox', { name: 'Search recommendations' })).not.toBeInTheDocument();
  expect(within(nav).getByRole('link', { name: /Patient recommendations/ })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await travelHistory('back');
  expect(screen.getByRole('textbox', { name: 'Search recommendations' })).toHaveValue('nodule');
  expect(screen.getByRole('button', { name: 'Thyroid' })).toHaveAttribute('aria-pressed', 'true');
  await travelHistory('forward');
  expect(screen.getByRole('heading', { name: 'Thyroid nodules', level: 1 })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole('button', { name: 'Türkçe' }));
  expect(window.location.pathname).toBe('/patient-advice/tiroid-nodulu');
  expect(new URLSearchParams(window.location.search).get('q')).toBe('nodule');
  expect(screen.getByRole('heading', { name: 'Tiroid nodülü', level: 1 })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: /Tüm öneriler/ }));
  fireEvent.click(screen.getByRole('link', { name: /Ana sayfaya dön/ }));
  expect(window.location.pathname).toBe('/');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Rıza Gökhan');
  expect(screen.queryByRole('heading', { name: 'Deneyim ve eğitim' })).not.toBeInTheDocument();
});

test.each(['#patient-advice', '#patient-advice/tiroid-nodulu'])(
  'redirects legacy shared links: %s',
  async (hash) => {
    window.history.replaceState(null, '', `/?lang=tr${hash}`);
    render(<App />);
    expect(window.location.pathname).toBe(`/${hash.slice(1)}`);
    expect(window.location.search).toBe('?lang=tr');
    expect(window.location.hash).toBe('');
    await screen.findByRole('heading', {
      name: hash.includes('/') ? 'Tiroid nodülü' : 'Hastalara Öneriler',
      level: 1,
    });
  },
);

test('redirects an old article URL without a language and returns to an academic section', async () => {
  window.history.replaceState(null, '', '/#patient-advice/tiroid-nodulu');
  render(<App />);
  await screen.findByRole('heading', { name: 'Thyroid nodules', level: 1 });
  expect(window.location.pathname).toBe('/patient-advice/tiroid-nodulu');
  expect(window.location.search).toBe('?lang=en');
  fireEvent.click(screen.getByRole('link', { name: 'Publications' }));
  expect(window.location.pathname).toBe('/publications');
  expect(window.location.hash).toBe('');
  expect(screen.getByRole('textbox', { name: 'Search publications' })).toBeInTheDocument();
});

test('unknown page routes provide a home link', () => {
  window.history.replaceState(null, '', '/missing-page?lang=tr');
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Sayfa bulunamadı' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: /Ana sayfaya dön/ }));
  expect(window.location.pathname).toBe('/');
});

test('restores a GitHub Pages deep link including its query and hash before mounting', async () => {
  const target = '/patient-advice/tiroid-nodulu?lang=tr&q=tiroid&category=thyroid#main';

  window.history.replaceState(null, '', `/?__route=${encodeURIComponent(target)}`);
  restorePageRoute();
  expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe(
    target,
  );
  render(<App />);
  expect(
    await screen.findByRole('heading', { name: 'Tiroid nodülü', level: 1 }),
  ).toBeInTheDocument();
});

test.each(['https://example.com/', '//example.com/', '/\\example.com/'])(
  'does not restore an external redirect target: %s',
  (target) => {
    window.history.replaceState(null, '', `/?__route=${encodeURIComponent(target)}`);
    restorePageRoute();
    expect(window.location.pathname).toBe('/');
  },
);

test.each([
  ['/experience', 'Experience', 'Experience & education'],
  ['/publications', 'Publications', 'Publications'],
  ['/presentations', 'Presentations', 'Conference presentations'],
  ['/affiliations', 'Affiliations & languages', 'Affiliations & languages'],
])('opens %s as a dedicated page with current header navigation', (path, label, heading) => {
  window.history.replaceState(null, '', `${path}?lang=en`);
  render(<App />);

  const nav = screen.getByRole('navigation', { name: 'Main navigation' });

  expect(within(nav).getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Academic profile/ })).toHaveAttribute(
    'href',
    '/academic-profile?lang=en',
  );
  expect(fetch).not.toHaveBeenCalled();
});

test.each(['experience', 'publications', 'presentations', 'affiliations', 'academic-profile'])(
  'redirects the legacy #%s academic section to a dedicated page',
  (section) => {
    window.history.replaceState(null, '', `/?lang=tr#${section}`);
    render(<App />);
    expect(window.location.pathname).toBe(`/${section}`);
    expect(window.location.search).toBe('?lang=tr');
    expect(window.location.hash).toBe('');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  },
);

test('menu toggle, Escape, and page selection preserve keyboard navigation', () => {
  render(<App />);

  const toggle = screen.getByRole('button', { name: 'Menu' });
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(nav, { key: 'Escape' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
  fireEvent.click(toggle);
  fireEvent.click(within(nav).getByRole('link', { name: 'Experience' }));
  expect(window.location.pathname).toBe('/experience');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(
    screen.getByRole('heading', { level: 1, name: 'Experience & education' }),
  ).toBeInTheDocument();
});

test.each(['/development?lang=tr', '/?lang=tr#development'])(
  'redirects retired professional development links: %s',
  (url) => {
    window.history.replaceState(null, '', url);
    render(<App />);
    expect(window.location.pathname).toBe('/academic-profile');
    expect(window.location.search).toBe('?lang=tr');
    expect(screen.queryByRole('link', { name: /Mesleki gelişim/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Mesleki gelişim/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Akademik profil', level: 1 })).toBeInTheDocument();
  },
);
