
import { useState } from 'react';
import { Modal } from '../../Modal';
import SanitizedHtml from '../../SanitizedHtml/SanitizedHtml';
import { useTranslation } from 'react-i18next';
import { Button } from '@astryxdesign/core/Button';
import { useAppDispatch } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';
import { clearSelectedPacksAndCards } from '../../../store/ui/selectedPacks';

const RemoveAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <Button
                variant="destructive"
                label={t('remove_all')}
                icon={<IconForConcept concept="delete" />}
                onClick={() => setIsModalOpen(true)} />

            
            <Modal
                title={t(`modal.delete_all_packs.title`)}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onAccept={() => { 
                    dispatch<any>(clearSelectedPacksAndCards());
                }} >
                <SanitizedHtml html={t('modal.delete_all_packs.content')} />
            </Modal >
        </>
    )
}

export default RemoveAllButton