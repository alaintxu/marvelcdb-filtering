
import { Modal, ModalButton } from '../../Modal';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks/useStore';
import IconForConcept from '../../IconForConcept';
import { clearSelectedPacksAndCards } from '../../../store/ui/selectedPacks';

const RemoveAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    return (
        <>
            <ModalButton className='btn btn-danger' modal_id='modal-remove-all'>
                <IconForConcept concept="delete" />
                &nbsp;
                {t('remove_all')}
            </ModalButton>

            
            <Modal
                title={t(`modal.delete_all_packs.title`)}
                modal_id='modal-remove-all'
                onAccept={() => { 
                    dispatch<any>(clearSelectedPacksAndCards());
                }} >
                <div dangerouslySetInnerHTML={{ __html: t('modal.delete_all_packs.content') }} />
            </Modal >
        </>
    )
}

export default RemoveAllButton