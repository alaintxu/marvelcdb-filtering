
import { BsTrash } from 'react-icons/bs';
import { Modal, ModalButton } from '../../Modal';
import { useTranslation } from 'react-i18next';
import { selectAllPacks, unloadPackCards } from '../../../store/entities/packs';
import { removeAllCards } from '../../../store/entities/cards';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';

const RemoveAllButton = () => {
    const { t } = useTranslation('global');
    const dispatch = useAppDispatch();
    const packs = useAppSelector(selectAllPacks);
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
                    for(const pack of packs){
                        dispatch(unloadPackCards(pack.code));
                        dispatch(removeAllCards())
                    }
                }} >
                <div dangerouslySetInnerHTML={{ __html: t('modal.delete_all_packs.content') }} />
            </Modal >
        </>
    )
}

export default RemoveAllButton