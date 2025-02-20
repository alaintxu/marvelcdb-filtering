import { useTranslation } from 'react-i18next'
import { checkLanguageString, I18N_LANGS } from '../../i18n'
import { BsTranslate } from 'react-icons/bs'
import { useEffect } from 'react'

type Props = {
  onLanguageUpdated?: (newLanguage: string) => void
}

const LanguageSelect = ({onLanguageUpdated}: Props) => {
  // @ToDo: Re-download cards from selected packs after language is updated.
  const { t, i18n } = useTranslation('global');
  useEffect(() => {
    const checkedLanguage = checkLanguageString(i18n.language);
    if (checkedLanguage !== i18n.language) {
      i18n.changeLanguage(checkedLanguage);
    }
  }, [i18n.language]);
  return (
    <div className="input-group mb-1">
      <label className="input-group-text" htmlFor="langSelect">
        <BsTranslate />
        &nbsp;
        {t('language')}
      </label>
      <select
        className="form-select"
        key="lang-select"
        id="langSelect"
        onChange={(event) => {
          console.debug("Language select changed", event.target.value);
          i18n.changeLanguage(event.target.value);
          if (onLanguageUpdated) onLanguageUpdated(event.target.value);
          }
        }
        value={i18n.language}
      >
        {I18N_LANGS.map((lang) => <option
          key={`lang-select-option-${lang}`}
          title={`lang-select-option-${lang}`}
          value={lang}
        >
          {t('lang.' + lang)}
        </option>
        )}
      </select>
      </div>
  )
}

export default LanguageSelect