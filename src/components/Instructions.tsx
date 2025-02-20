import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { BsExclamationOctagonFill, BsQuestionCircleFill } from 'react-icons/bs';

const Instructions = () => {
  const { t } = useTranslation('instructions');
  return (

    <section id="mc-card-list" className='p-3 card bg-secondary'>
      <div className='card-body'>
        <h1 className='card-title'>
          {t('title')}
        </h1>
        <div className='card-text'>
          <div className="alert alert-warning d-flex align-items-center gap-3" role="alert">
            <BsExclamationOctagonFill />
            <div>
              <Markdown>
                {t('alert_md')}
              </Markdown>
            </div>
          </div>
          <div className="alert alert-info d-flex align-items-center gap-3" role="alert">
            <BsQuestionCircleFill />
            <div>
              <Markdown>
                {t('instructions_md')}
              </Markdown>
            </div>
          </div>
          <div className="alert alert-info d-flex align-items-center gap-3" role="alert">
            <BsQuestionCircleFill />
            <div>
              <Markdown>
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