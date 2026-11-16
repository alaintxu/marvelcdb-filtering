import { useTranslation } from 'react-i18next'
import { checkLanguageString, I18N_LANGS } from '../../i18n'
import { useEffect } from 'react'
import * as stylex from '@stylexjs/stylex'
import IconForConcept from '../IconForConcept'
import { ui } from '../../styles/ui'

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
    <div {...stylex.props(ui.inputGroup, ui.mb1)}>
      <label {...stylex.props(ui.inputGroupText, ui.ms1)} htmlFor="langSelect">
        <IconForConcept concept="translate" />
        &nbsp;
        {t('language')}
      </label>
      <select
        {...stylex.props(ui.formControl)}
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
