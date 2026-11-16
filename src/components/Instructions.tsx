import { useTranslation } from 'react-i18next';
import { Markdown } from '@astryxdesign/core/Markdown';
import * as stylex from '@stylexjs/stylex';
import IconForConcept from './IconForConcept';
import { ui } from '../styles/ui';

const Instructions = () => {
  const { t } = useTranslation('instructions');
  return (

    <section id="mc-card-list" {...stylex.props(ui.p3, ui.card, ui.bgSecondary, ui.textDark)}>
      <div {...stylex.props(ui.cardBody)}>
        <h1 {...stylex.props(ui.cardTitle)}>
          {t('title')}
        </h1>
        <div>
          <div {...stylex.props(ui.alert, ui.alertWarning, ui.itemsCenter, ui.gap3)} data-alert="true" role="alert">
            <IconForConcept concept="warning" />
            <div>
              <Markdown contentWidth="100%">
                {t('alert_md')}
              </Markdown>
            </div>
          </div>
          <div {...stylex.props(ui.alert, ui.alertInfo, ui.itemsCenter, ui.gap3)} data-alert="true" role="alert">
            <IconForConcept concept="info" />
            <div>
              <Markdown contentWidth="100%">
                {t('instructions_md')}
              </Markdown>
            </div>
          </div>
          <div {...stylex.props(ui.alert, ui.alertInfo, ui.itemsCenter, ui.gap3)} data-alert="true" role="alert">
            <IconForConcept concept="info" />
            <div>
              <Markdown contentWidth="100%">
                {t('reset_help_md')}
              </Markdown>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Instructions
