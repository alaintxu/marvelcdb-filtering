import { useSelector } from 'react-redux'
import { selectNumberOfPackStatusByDownloadStatus, selectPackStatusBootstrapVariant } from '../../../store/ui/packsStatus'
import { selectNumberOfCards } from '../../../store/entities/cards';
import { selectNumberOfPacks } from '../../../store/entities/packs';
import { useTranslation } from 'react-i18next';

const PacksData = () => {
    const {t} = useTranslation("global");
    const numberOfDownloadedPacks = useSelector(selectNumberOfPackStatusByDownloadStatus("downloaded"));
    const numberOfPacks = useSelector(selectNumberOfPacks)
    const numberOfCards = useSelector(selectNumberOfCards);
    const packStatusVariant = useSelector(selectPackStatusBootstrapVariant)
  return (
    <div id="pack-data"
          className='d-flex flex-column align-items-center justify-content-center gap-1 mb-4'
        >
          <span>
            <b>{t('downloaded_packs')}</b>
            &nbsp;
            <span className={`badge bg-${packStatusVariant}`}>{numberOfDownloadedPacks}</span>
            /
            <span className='badge bg-light text-dark'>{numberOfPacks}</span>
          </span>
          <span>
            <span className='badge bg-info'>{numberOfCards}</span>
            &nbsp;
            <b>{t('downloaded_cards')}</b>
          </span>
        </div>
  )
}

export default PacksData