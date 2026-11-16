import { useTranslation } from 'react-i18next'
import { checkLanguageString, I18N_LANGS } from '../../i18n'
import { useEffect } from 'react'
import * as stylex from '@stylexjs/stylex'
import IconForConcept from '../IconForConcept'
import { ui } from '../../styles/ui'
import { InputGroup, InputGroupText } from '@astryxdesign/core/InputGroup'
import { Selector } from '@astryxdesign/core/Selector'

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
    <div {...stylex.props(ui.mb1)}>
      <InputGroup label={t('language')} isLabelHidden>
        <InputGroupText>
          <IconForConcept concept="translate" />
          &nbsp;
          {t('language')}
        </InputGroupText>
        <Selector
          label={t('language')}
          isLabelHidden
          options={I18N_LANGS.map((lang) => ({ value: lang, label: t('lang.' + lang) }))}
          value={i18n.language}
          onChange={(newLanguage) => {
            console.debug("Language select changed", newLanguage);
            i18n.changeLanguage(newLanguage);
            if (onLanguageUpdated) onLanguageUpdated(newLanguage);
          }}
        />
      </InputGroup>
    </div>
  )
}

export default LanguageSelect
