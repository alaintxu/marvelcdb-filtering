import { useState } from 'react';
import { Modal } from '../../Modal';
import SanitizedHtml from '../../SanitizedHtml/SanitizedHtml';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { useAppDispatch } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';
import { selectAllPackCodesAndDownload } from '../../../store/ui/selectedPacks';

const DownloadAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                variant="destructive"
                label={t('download_all')}
                icon={<IconForConcept concept="downloadSimple" />}
                onClick={() => setIsModalOpen(true)} />

            <Modal
                title={t(`modal.download_all_packs.title`)}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onAccept={async () => {
                    await dispatch<any>(selectAllPackCodesAndDownload());
                }}>
                <SanitizedHtml html={t('modal.download_all_packs.content')} />
            </Modal>
        </>
    )
}

export default DownloadAllButton