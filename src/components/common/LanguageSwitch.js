import { Language } from 'constants/languages';

const LanguageSwitch = ({ language, setLanguage }) => {
  return (
    <div
      className='language-switch'
      role='group'
      aria-label={language === Language.TURKISH ? 'Dil seçimi' : 'Language selection'}
    >
      <button
        type='button'
        lang={Language.ENGLISH}
        aria-label='English'
        aria-pressed={language === Language.ENGLISH}
        onClick={() => setLanguage(Language.ENGLISH)}
      >
        EN
      </button>
      <button
        type='button'
        lang={Language.TURKISH}
        aria-label='Türkçe'
        aria-pressed={language === Language.TURKISH}
        onClick={() => setLanguage(Language.TURKISH)}
      >
        TR
      </button>
    </div>
  );
};

export default LanguageSwitch;
