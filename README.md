# Rıza Gökhan Baykal — Academic Profile

A responsive React academic CV based on the supplied curriculum vitae. Includes clinical experience, education, searchable publications with year and type filters, full citations and DOI links, conference presentations, professional development, society memberships, and language assessments.

## Local development

```sh
npm install
npm start
```

Open http://localhost:3000. The development URL is local; deploy the production build to a static hosting service before sharing the profile publicly.

## Production build

```sh
npm run build
```

Deploy the generated `build/` directory. For hosting under a subdirectory, configure Create React App's `homepage` before building.

## Updating the CV

- `src/data/cv.json`: publication titles, full citations, DOI identifiers, years, types, and grouped conference presentations.
- `src/data/profile.js`: clinical experience, training, affiliations, languages, and CV download URL.
- `src/styles/app.css`: typography, colors, desktop and mobile layouts.
- `src/utils/i18n.js`: English/Turkish translation mapping and initial language selection. The header switch remembers the selection locally; `?lang=en` or `?lang=tr` takes priority for shared links. Academic citations retain their source language.
- `public/documents/riza-gokhan-baykal-cv.docx`: original downloadable CV.
- `public/index.html`: page title, description, and sharing metadata.

Publication and presentation details are transcribed from the supplied document. Nunito is self-hosted in `src/assets/fonts/` under the included SIL Open Font License 1.1, with Turkish characters and system font fallbacks. No backend or credentials are required.

## Patient recommendations

The website now separates patient information from the academic CV. The **Hastalara Öneriler / Patient recommendations** section loads `public/content/patient-tips.json` at runtime, with topic filters, search, complete article views, shareable links, English/Turkish content, and optional local file attachments.

To add a note, copy the draft entry, fill in its content, and set `status` to `published`. Upload the JSON and any attachments to the hosted `content/` directory. JavaScript does not need to be rebuilt when replacing files on a mutable static host; deployment-based hosts require a new content deployment. Editing a local folder alone does not change a remote host.

See [the content guide](docs/patient-content.md) for the schema, examples, sharing format, and hosting details. The library includes eight patient handouts in Turkish and English, plus a draft template for future notes. Original Turkish documents are available where attached; the approved Graves smoking correction is documented in the content guide.

Patient handout source documents are archived in `docs/patient-sources/`. Only live downloads and runtime content are included in `public/`.

## Source structure

```text
src/
  App.js                 Page composition
  index.js               React entry point
  components/
    common/              Icons, headings, language switch
    layout/              Header, sidebar, footer
    profile/             Overview and academic CV sections
    patients/            Patient library, article cards, reader, body blocks
  assets/               Bundled vector assets
  data/                 CV records, profile details, navigation
  hooks/                Language, section navigation, fetching, clipboard
  styles/               Shared and patient section styles
  utils/                Translation, content validation/search, article URLs
  tests/                Integration and content tests
public/content/          JSON and attachments fetched at runtime
docs/                    Editing guide and original source documents
```

`App.js` composes the page; feature components own their local UI state. Shared hooks handle browser side effects. The patient JSON remains in `public/content/` so it can be replaced on the host without recompiling the application. Bundled visual assets belong in `src/assets/`.

Run regression checks with `CI=true npm test -- --watchAll=false --runInBand` and build with `npm run build`.

## GitHub Pages

Production URL: https://ahmet-cngz.github.io/gokhanbaykalmd/

The workflow in `.github/workflows/deploy-pages.yml` tests, builds, and deploys pushes to `develop`. It can also be started manually from the Actions tab. The `homepage` field in `package.json` ensures scripts, styles, patient JSON, and downloads use the repository's `/gokhanbaykalmd/` base path.

The repository owner must enable **Settings → Pages → Build and deployment → Source: GitHub Actions** once. Afterward, successful pushes to `develop` deploy automatically.

To update patient content on GitHub Pages, edit `public/content/patient-tips.json` and any attachments, commit, and push. Pages serves deployed files; it does not expose a writable server directory. The workflow includes content changes in the next deployment.

## Code style

Use arrow functions for components, hooks, helpers, and callbacks. Shared language values and locale mappings live in `src/constants/languages.js`; use `Language.ENGLISH` and `Language.TURKISH` in JavaScript. The patient JSON retains `en` and `tr` keys as its public content format.

Separate imports, hook effects, guard clauses, and returns with blank lines. Use braces for control flow. `.prettierrc.json` defines formatting; ESLint enforces function and spacing conventions. Run `npm run lint` before committing.

Use imports rooted at `src`, such as `import AcademicProfile from "components/profile/AcademicProfile"`. `jsconfig.json` configures this for the build, tests, and editor. ESLint rejects relative imports, orders imports alphabetically within dependency groups, and separates external packages from internal modules. The deployment workflow runs lint before tests and the production build.

Run `npm run format` to format all supported project files using single quotes (including JSX), or `npm run format:check` to check formatting. JSON retains double quotes as required by its syntax.
