import { useTranslation } from 'react-i18next';

type Props = {
  type?: 'border' | 'grow',
  small?: boolean,
  className?: string
}

const LoadingSpinner = ({type="grow", small=false, className=""}: Props) => {
  const { t } = useTranslation('global');
  return (
    <div className={`spinner-${type} ${small ? `spinner-${type}-sm` : ""} ${className}`} role="status">
        <span className="visually-hidden">{t('loading')}</span>
    </div>
  )
}

export default LoadingSpinner