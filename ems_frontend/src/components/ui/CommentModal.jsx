import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

const CommentModal = ({ isOpen, onClose, onSendData,commentError }) => {
    if (!isOpen) return null;

    const [comment, setComment] = useState('');
    return (
        <div className="h-screen w-screen fixed bg-[#0000005d] top-0 left-0 flex justify-center items-start z-100">
            <div className="bg-white p-5 w-1/3 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="w-full text-center">
                        <h2 className="text-2xl font-bold">Update Status</h2>
                    </div>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <div className="items-end">
                    <div className="mb-3">
                        <div className="flex items-center gap-2 ">
                            <label className="w-30 text-start">
                                Comment <span className="text-sm text-red-500">*</span>
                            </label>
                            <textarea row='2'
                                name='comment'
                                type="text"
                                className="flex-1 rounded-sm border p-2 border-[#989898]"
                                placeholder='comment'
                                onChange={(e)=>setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <p className="text-sm text-red-700">
                            {
                                commentError?.comment?.[0]
                            }
                        </p>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button className=" p-2 text-md font-semibold border hover:border-[#2b2ba6] hover:bg-white hover:text-[#2b2ba6] bg-[#2b2ba6]  rounded-md text-white w-15 text-center" onClick={()=>onSendData(comment)}>Ok</button>
                        <button className=" p-2 text-md font-semibold  border hover:border-gray-700 hover:text-gray-700 hover:bg-white bg-gray-700 text-white rounded-md w-15 text-center cursor-pointer"
                            onClick={onClose}>Cance</button>
                    </div>
                </div>
            </div>
        </div>)
}

export default CommentModal