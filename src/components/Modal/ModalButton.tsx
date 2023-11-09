import React from 'react';

type Props = {
  children: React.ReactNode,
  modal_id: string,
  className?: string,
  title?: string
}

const ModalButton = ({children, modal_id, className, title}:Props) => {
  return (
    <button
    className={className}
    title={title}
    type="button"
    data-bs-toggle="modal"
    data-bs-target={`#${modal_id}`}>
      {children}
    </button>
  )
}

export default ModalButton