import { Markdown } from "@astryxdesign/core/Markdown";
import { useTranslation } from "react-i18next";
import * as stylex from '@stylexjs/stylex';
import ResetAppButton from "../DownloadManager/ResetAppButton";
import { ui } from "../../styles/ui";


type Props = {
    error?: Error | null;
}

const MainErrorView = ({error}: Props) => {
  const {t} = useTranslation("error");
  return (
    <section {...stylex.props(ui.p3, ui.mt4, ui.centerBlock)}>
        <h1>{t('error_title')}</h1>
        {error && (
            <div {...stylex.props(ui.alert, ui.alertDanger)} data-alert="true">
                {error.message}
            </div>
        )}
        <Markdown contentWidth="100%">
            {t('error_instructions_md')}
        </Markdown>
        <ResetAppButton />
    </section>
  )
}

export default MainErrorView
