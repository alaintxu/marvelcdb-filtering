import { BsDownload } from 'react-icons/bs';
import { Modal, ModalButton } from '../Modal';
import { useTranslation } from 'react-i18next';
import { cardsSet } from '../../store/entities/cards';
import { packStatusDictSet } from '../../store/ui/packsStatus';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPacks } from '../../store/entities/packs';

type Props = {
    downloadPackCards: (packCode: string) => Promise<void>;
}

const DownloadAllButton = ({downloadPackCards}: Props) => {
    const { t } = useTranslation('global');
    const dispatch = useDispatch();
    const packs = useSelector(selectAllPacks);
    return (
        <>
            <ModalButton className='btn btn-danger me-1' modal_id='modal-select-all'>
                <BsDownload />
                &nbsp;
                {t('download_all')}
            </ModalButton>

            <Modal
                title={t(`modal.download_all_packs.title`)}
                modal_id='modal-select-all'
                onAccept={async () => {
                dispatch(cardsSet([]));
                dispatch(packStatusDictSet({}));
                if (!packs) return

                const batchSize = 10;
                for (let i = 0; i < packs.length; i += batchSize) {
                    const batch = packs.slice(i, i + batchSize);
                    await Promise.all(batch.map(async (pack) => downloadPackCards(pack.code)));
                }
                //await Promise.all(packs.map(async (pack) => downloadPackCards(pack.code)));
                }}>
                <div dangerouslySetInnerHTML={{ __html: t('modal.download_all_packs.content') }} />
            </Modal>
        </>
    )
}

export default DownloadAllButton