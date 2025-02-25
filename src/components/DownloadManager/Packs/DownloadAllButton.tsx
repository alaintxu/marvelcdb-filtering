import { BsDownload } from 'react-icons/bs';
import { Modal, ModalButton } from '../../Modal';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { loadPackCards, selectAllPacks } from '../../../store/entities/packs';
import { AppDispatch } from '../../../store/configureStore';

function delayedDispatch(dispatch: AppDispatch, action: any, delay: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            dispatch(action);
            resolve(void 0);
        }, delay);
    }
    );
}

const DownloadAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useDispatch<AppDispatch>();
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
                //dispatch(cardsSet([]));
                //dispatch(packStatusDictSet({}));
                if (!packs) return

                const batchSize = 10;
                for (let i = 0; i < packs.length; i += batchSize) {
                    const batch = packs.slice(i, i + batchSize);
                    await Promise.all(batch.map(async (pack) => delayedDispatch(dispatch, loadPackCards(pack.code), 1000)));
                }
                }}>
                <div dangerouslySetInnerHTML={{ __html: t('modal.download_all_packs.content') }} />
            </Modal>
        </>
    )
}

export default DownloadAllButton