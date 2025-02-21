
import { BsTrash } from 'react-icons/bs';
import { Modal, ModalButton } from '../../Modal';
import { useTranslation } from 'react-i18next';
import { cardsSet } from '../../../store/entities/cards';
import { packStatusDictSet } from '../../../store/ui/packsStatus';
import { useDispatch } from 'react-redux';

const RemoveAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useDispatch();
    return (
        <>
            <ModalButton className='btn btn-danger' modal_id='modal-remove-all'>
                <BsTrash />
                &nbsp;
                {t('remove_all')}
            </ModalButton>

            
            <Modal
                title={t(`modal.delete_all_packs.title`)}
                modal_id='modal-remove-all'
                onAccept={() => { 
                    dispatch(cardsSet([]));
                    dispatch(packStatusDictSet({}));
                }} >
                <div dangerouslySetInnerHTML={{ __html: t('modal.delete_all_packs.content') }} />
            </Modal >
        </>
    )
}

export default RemoveAllButton