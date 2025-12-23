import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const Modal = ({ isOpen, title, onClose, children }) => {
        if (!isOpen) return null;
  return (
        <div className="h-screen w-screen fixed bg-[#000000b8] top-0 left-0 flex justify-center items-center z-50">
            <div className="bg-white p-5 w-1/3 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold uppercase">{title}</h2>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                {children}
            </div>
        </div>  )
}

export default Modal