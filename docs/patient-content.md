# Patient information content

The website fetches `patient-tips.json` at runtime. Edit this JSON to add notes without changing React code. Place optional PDFs, images, or other attachments in `files/`.

## Publish a new note

1. Copy the `ornek-hasta-notu` draft object in `patient-tips.json`.
2. Give it a unique, stable `id` using lowercase letters, numbers, and hyphens, such as `tiroid-kontrolu`.
3. Choose an existing category ID, or add a category with Turkish and optional English titles.
4. Write the Turkish title, short summary, and body in `tr`. Add an optional `en` object with the same structure for English. If English is omitted, English visitors see the Turkish note with a language notice.
5. Set `updatedAt` to a real date in `YYYY-MM-DD` format.
6. Set `status` to `published` when the text is ready. `featured: true` places it ahead of other notes; within each group, the latest update appears first.
7. Upload the edited JSON and any new files to the hosted `content/` folder. Reload the website.

Drafts are omitted from the website list, but the JSON file is public, so do not store confidential material in it.

## Body blocks

```json
[
  { "type": "paragraph", "text": "Bir paragraf." },
  { "type": "heading", "text": "Alt başlık" },
  { "type": "list", "items": ["İlk madde", "İkinci madde"] }
]
```

Text is rendered as plain text. HTML and Markdown are not interpreted.

## Attach a file

Save a file as `content/files/tiroid-bilgi.pdf` on the host, then add:

```json
"attachments": [
  {
    "path": "files/tiroid-bilgi.pdf",
    "label": { "tr": "Tiroid bilgilendirme dosyası (PDF)", "en": "Thyroid information (PDF)" }
  }
]
```

Attachment paths must remain under `files/`. Notes do not require an attachment.

## Sharing

The reader's Copy link button creates a link such as:

`https://your-domain.example/?lang=tr#patient-advice/tiroid-kontrolu`

Keep IDs stable so previously shared links continue to work. Removing a note or changing its status to draft makes its old link show a not-found message.

## Hosting

During development, edit `public/content/patient-tips.json` and refresh the page. `npm run build` copies this directory to `build/content/`.

On a server where you can upload files directly, replace `content/patient-tips.json` in the served directory. No JavaScript rebuild is needed. Also update the source copy under `public/content/` so future builds retain your edits.

On hosting services with immutable deployments, publish a new deployment containing the updated content directory. The browser cannot write to the server folder; this website is a reader, not an admin uploader.

The browser requests the JSON with `cache: no-store`. Configure the host/CDN to avoid caching this JSON or purge its cached copy when updating it. Do not open `index.html` with a `file://` URL; serve the site over HTTP or HTTPS.

Malformed content shows a retry state. The runtime validates required fields, dates, IDs, block types, categories, and attachment paths. To check JSON syntax before uploading:

```sh
node -e "JSON.parse(require('fs').readFileSync('public/content/patient-tips.json', 'utf8')); console.log('Valid JSON')"
```

## Imported patient documents

Eight Turkish DOCX handouts from `docs/patient-sources/` have been transcribed into full Turkish articles and translated into English. Their original section structure, numeric instructions, warnings, and supplied references are preserved. `sourceDocument` records each original filename. The welcome/example note has been replaced by these patient handouts; the editable draft remains available in the JSON.

The gestational diabetes handout also uses the following supported block:

```json
{ "type": "table", "headers": ["Measurement time", "General target"], "rows": [["Fasting", "Below 95 mg/dL"]] }
```

`keywords` is an optional array of search aliases. The PMOS article includes `PKOS`, `PCOS`, and `PMOS`, while retaining the PMOS wording used in the supplied document.

### Approved web correction

The original Graves handout says not to stop smoking suddenly. On 17 October 2026, the user approved replacing that sentence in both web versions with advice to seek support to stop smoking. The rest of the handout was translated faithfully. The original DOCX remains unchanged under `docs/patient-sources/`. Its download link is omitted from the patient article until that source is corrected, to avoid distributing conflicting instructions. The other seven original Turkish DOCX files are attached to their corresponding articles.

Reference for the smoking correction: [American Thyroid Association — Thyroid Eye Disease](https://www.thyroid.org/thyroid-eye-disease/), Prevention section. The new PMOS terminology was also checked against [Monash University's guideline page](https://www.monash.edu/medicine/mchri/pcos/guideline).

Update the JSON article as well as any original/attached file when revising a handout. DOCX files are not parsed by the visitor's browser.
