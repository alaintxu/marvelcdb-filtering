import { Modal, ModalButton } from '../Modal';
import { useTranslation } from 'react-i18next';
import IconForConcept from '../IconForConcept';


export const resetApp = () => {
    localStorage.clear();
    window.location.reload();
}

const ResetAppButton = () => {
    const { t } = useTranslation('global');
    return (
            <>
            <ModalButton className='btn btn-danger' modal_id='modal-reset-app'>
                <IconForConcept concept="reset" />
                &nbsp;
                {t('reset_app')}
                </ModalButton>
            <Modal
                title={t(`modal.reset_app.title`)}
                modal_id='modal-reset-app'
                onAccept={() => {
                    resetApp();
                }}>
                <div dangerouslySetInnerHTML={{ __html: t('modal.reset_app.content') }} />
            </Modal>
        </>
    )
}

export default ResetAppButton