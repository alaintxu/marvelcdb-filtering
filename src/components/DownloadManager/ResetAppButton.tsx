import { useState } from 'react';
import { Modal } from '../Modal';
import SanitizedHtml from '../SanitizedHtml/SanitizedHtml';
import { useTranslation } from 'react-i18next';
import IconForConcept from '../IconForConcept';
import { Button } from '@astryxdesign/core/Button';
import { clearPersistedCards } from '../../store/persistence/cardsDb';


export const resetApp = () => {
    clearPersistedCards()
        .catch((e) => console.error('Error clearing cards from IndexedDB', e))
        .finally(() => {
            localStorage.clear();
            window.location.reload();
        });
}

const ResetAppButton = () => {
    const { t } = useTranslation('global');
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
            <>
            <Button
                variant="destructive"
                label={t('reset_app')}
                icon={<IconForConcept concept="reset" />}
                onClick={() => setIsModalOpen(true)} />
            <Modal
                title={t(`modal.reset_app.title`)}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onAccept={() => {
                    resetApp();
                }}>
                <SanitizedHtml html={t('modal.reset_app.content')} />
            </Modal>
        </>
    )
}

export default ResetAppButton