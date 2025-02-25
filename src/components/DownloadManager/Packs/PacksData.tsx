import { useSelector } from 'react-redux'
import { selectNumberOfCards } from '../../../store/entities/cards';
import { selectNumberOfDownloadedPacks, selectNumberOfPacks, selectPackStatusBootstrapVariant } from '../../../store/entities/packs';
import { useTranslation } from 'react-i18next';
import IconForConcept from '../../IconForConcept';

const PacksData = () => {
    const {t} = useTranslation("global");
    const numberOfDownloadedPacks = useSelector(selectNumberOfDownloadedPacks);
    const numberOfPacks = useSelector(selectNumberOfPacks)
    const numberOfCards = useSelector(selectNumberOfCards);
    const packStatusVariant = useSelector(selectPackStatusBootstrapVariant)
  return (
    <div id="pack-data"
          className='d-flex flex-column align-items-center justify-content-center gap-1 mb-4'
        >
          <span className="d-flex align-items-center gap-2">
            <IconForConcept concept="packFill"/>
            <b>{t('downloaded_packs')}</b>
            <span className={`badge bg-${packStatusVariant}`}>{numberOfDownloadedPacks}</span>
            /
            <span className='badge bg-light text-dark'>{numberOfPacks}</span>
          </span>
          <span className="d-flex align-items-center gap-2">
            <IconForConcept concept="cardFill"/>
            <b>{t('downloaded_cards')}</b>
            <span className='badge bg-info'>{numberOfCards}</span>
          </span>
        </div>
  )
}

export default PacksData