import Markdown from "react-markdown";
import ResetAppButton from "../DownloadManager/ResetAppButton";
import { useTranslation } from "react-i18next";


type Props = {
    error?: Error | null;
}

const MainErrorView = ({error}: Props) => {
  const {t} = useTranslation("error");
  return (
    <section className="container mt-4">
        <h1>{t('error_title')}</h1>
        {error && (
            <div className="alert alert-danger">
                {error.message}
            </div>
        )}
        <Markdown>
            {t('error_instructions_md')}
        </Markdown>
        <ResetAppButton />
    </section>
  )
}

export default MainErrorView