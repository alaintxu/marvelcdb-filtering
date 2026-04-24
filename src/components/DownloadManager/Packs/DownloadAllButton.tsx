import { Modal, ModalButton } from '../../Modal';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';
import { selectAllPackCodesAndDownload } from '../../../store/ui/selectedPacks';

const DownloadAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();

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
                    await dispatch<any>(selectAllPackCodesAndDownload());
                }}>
                <div dangerouslySetInnerHTML={{ __html: t('modal.download_all_packs.content') }} />
            </Modal>
        </>
    )
}

export default DownloadAllButton