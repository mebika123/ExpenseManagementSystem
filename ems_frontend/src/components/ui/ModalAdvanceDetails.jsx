import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import CommentModal from './CommentModal';

const ModalAdvanceDetails = ({ isOpenDetail, id, onCloseDetail }) => {
    if (!isOpenDetail) return null;

    const [advance, setAdvance] = useState([]);
    const { navigate } = useNavigate

    useEffect(() => {
        const fetchAdvance = async () => {
            const res = await axiosInstance.get(`/advances/${id}`)
            setAdvance(res.data.advance)
        }
        fetchAdvance()
    }, [id])

    const [isOpen, setIsOpen] = useState(false)

    const [pendingStatus, setPendingStatus] = useState()
    const [commentError, setCommentError] = useState('');

    const changeStatus = (status) => {
        setIsOpen(true);
        setPendingStatus(status);
    }
    const handelCommentModal = async (data) => {
        const payload = {
            status: pendingStatus,
            advance_id: id,
            comment: data
        };

        try {
            setCommentError({});
            const res = await axiosInstance.post('/advance/updatedStatus', payload);
            if (res) {
                alert(res.data.message)
                setIsOpen(false);
                onCloseDetail();
                navigate('/advances')
            }

        } catch (error) {
            if (error.response?.status === 422) {
                setCommentError(error.response.data.errors);
                console.log(error.response.data.errors)
            }
        }
    };

    return (<>

        <CommentModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSendData={handelCommentModal}
            commentError={commentError}
        />
        <div className="h-screen w-screen fixed bg-[#000000b8] top-0 left-0 flex justify-center items-center z-50">
            <div className="bg-white p-5 w-2/5 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="w-full">
                        <h2 className="text-2xl font-bold  text-center">Advance Details</h2>
                    </div>
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="cursor-pointer"
                        onClick={onCloseDetail}
                    />
                </div>
                {
                    advance?.latest_status?.[0]?.status !== 'approved' &&
                    <div className="mb-6 w-full  gap-2 flex justify-end">
                        {
                            advance?.latest_status?.[0]?.status == 'pending' &&
                            <>
                                <button type='button' className="px-4 py-2 bg-[#38bf80]  rounded-lg text-white w-28" onClick={() => changeStatus('checked')}>Checked</button>
                                <button type='button' className="px-4 py-2 bg-[#f72e2e]  rounded-lg text-white w-28" onClick={() => changeStatus('rejected')}>Reject</button>
                            </>
                        }
                        {
                            advance?.latest_status?.[0]?.status == 'checked' &&
                            <>
                                <button type='button' className="px-4 py-2 bg-[#408cb5]  rounded-lg text-white w-28" onClick={() => changeStatus('approved')}>Approve</button>
                                <button type='button' className="px-4 py-2 bg-[#f72e2e]  rounded-lg text-white w-28" onClick={() => changeStatus('rejected')}>Reject</button>
                            </>
                        }

                        {
                            advance?.latest_status?.[0]?.status == 'rejected' &&
                            <button type='button' className="px-4 py-2 bg-[#492ef7]  rounded-lg text-white w-28" onClick={() => changeStatus('pending')}>ReSubmit</button>

                        }

                    </div>

                }
                {/* <div className="flex justify-end ml-10">
                    <Link to={`/advance/edit/${id}`} className="px-4 w-24 text-center py-2 bg-[#32b274]  rounded-lg text-white ">Edit</Link>

                </div> */}
                <div className="flex justify-center items-center">
                    <div className="w-5/6">

                        <div className="mb-3">
                            <div className="flex items-center gap-3">
                                <div className='font-bold'>Contact:</div>
                                <div className="">{advance?.contact?.code}</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="flex items-center gap-3">
                                <div className='font-bold'>Amount:</div>
                                <div className="">{advance?.amount}</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="flex items-center gap-3">
                                <div className='font-bold '>Expense Plan:</div>
                                <div className="">{advance?.expense_plan?.code}</div>
                            </div>

                        </div>
                        <div className="mb-3">
                            <div className="flex items-center gap-3">
                                <div className='font-bold '>Purpose:</div>
                                <div className="">{advance?.purpose}</div>
                            </div>

                        </div>
                        <div className="mb-3">
                            <div className="flex items-center gap-3">
                                <div className='font-bold '>Status:</div>
                                <div className="">{advance?.latest_status?.[0]?.status}</div>
                            </div>

                        </div>


                    </div>

                </div>
            </div>
        </div>
    </>
    )
}

export default ModalAdvanceDetails