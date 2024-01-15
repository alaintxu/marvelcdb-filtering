import { useTranslation } from 'react-i18next';

const Instructions = () => {
  const { t } = useTranslation('instructions');
  return (

    <section id="mc-card-list" className='p-3 card bg-secondary'>
      <div className='card-body'>
        <h1 className='card-title'>
          {t('instructions_title')}
        </h1>
        <div className='card-text'>
          <p>
            {t('instructions_text')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Instructions