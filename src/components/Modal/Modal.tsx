import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  children: React.ReactNode,
  modal_id: string,
  title: string,
  onCancel?: () => void,
  onAccept?: () => void
}

const Modal = ({ children, modal_id, title, onCancel, onAccept }: Props) => {
  const {t} = useTranslation('modal');
  const label_id = modal_id + "-label";
  return (<>
    <div className="modal fade text-dark"
      id={modal_id}
      role="dialog"
      tabIndex={-1}
      aria-labelledby={label_id}
      aria-hidden="true">
      <div className="modal-dialog"
      style={{width: "max-content", maxWidth: "90%"}}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={label_id}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label={t('close')}>
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => { if (onCancel) onCancel() }}>
              {t('close')}
            </button>
            {onAccept && <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() => onAccept()}>
              {t('continue')}
            </button>
            }
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Modal