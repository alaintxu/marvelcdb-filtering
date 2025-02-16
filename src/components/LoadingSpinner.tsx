import { useTranslation } from 'react-i18next';

const LoadingSpinner = () => {
  const { t } = useTranslation('global');
  return (
    <div className="spinner-border" role="status">
        <span className="visually-hidden">{t('loading')}</span>
    </div>
  )
}

export default LoadingSpinner