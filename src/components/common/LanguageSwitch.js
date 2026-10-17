export default function LanguageSwitch({ language, setLanguage }) {
  return (
    <div
      className="language-switch"
      role="group"
      aria-label={language === "tr" ? "Dil seçimi" : "Language selection"}
    >
      <button
        type="button"
        lang="en"
        aria-label="English"
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        lang="tr"
        aria-label="Türkçe"
        aria-pressed={language === "tr"}
        onClick={() => setLanguage("tr")}
      >
        TR
      </button>
    </div>
  );
}
