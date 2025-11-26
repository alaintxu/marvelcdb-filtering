import { Modal, ModalButton } from '../../Modal';
import { useTranslation } from 'react-i18next';
import { loadPackCards, selectAllPacks } from '../../../store/entities/packs';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';

const DownloadAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const packs = useAppSelector(selectAllPacks);

    return (
        <>
            <ModalButton className='btn btn-danger me-1' modal_id='modal-select-all'>
                <IconForConcept concept="downloadSimple" />
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

                const batchSize = 5;
                for (let i = 0; i < packs.length; i += batchSize) {
                    const batch = packs.slice(i, i + batchSize);
                    //await Promise.all(batch.map(async (pack) => delayedDispatch(dispatch, loadPackCards(pack.code), 1000)));
                    await Promise.all(
                        batch.map(
                            async (pack) => dispatch<any>(loadPackCards(pack.code))
                        )
                    );
                    //await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                
                }}>
                <div dangerouslySetInnerHTML={{ __html: t('modal.download_all_packs.content') }} />
            </Modal>
        </>
    )
}

export default DownloadAllButton