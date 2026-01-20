import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link, useNavigate } from 'react-router-dom';
import CommentModal from './CommentModal';

const ShowRoleAndPermission
    = ({ isOpenDetail, id, onCloseDetail }) => {
        if (!isOpenDetail) return null;

        const[role,setRole] = useState();
        const[permissions,setPermissions] = useState();
        useEffect(() => {
            if (!id) return;

            const fetchFormData = async () => {
                try {
                    const res = await axiosInstance.get(`/roles/${id}`);

                    setRole(res.data.role);
                    setPermissions( res.data.permissions);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchFormData();
        }, [id]);

        return (<>
            <div className="h-screen w-screen fixed bg-[#000000b8] top-0 left-0 flex justify-center items-center z-50">
                <div className="bg-white p-5 w-2/5 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-full">
                            <h2 className="text-2xl font-bold  text-center">Role Details</h2>
                        </div>
                        <FontAwesomeIcon
                            icon={faXmark}
                            className="cursor-pointer"
                            onClick={onCloseDetail}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <div className="">
                            <div className="w-full mb-2 text-start">
                                <div className=" mb-4 flex items-center gap-4">
                                    <div className='font-semibold' >Role Name:</div>
                                    <div className="w-full lg:w-3/5 p-2">{role?.name}</div>

                                </div>
                            </div>
                            <div className="w-full mb-2 text-start">
                                <div className="">
                                    <div className='font-semibold' >Assign Permission:</div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {
                                            permissions?.map((permission, index) => (
                                                    <span className="bg-gray-100 px-2 py-1 rounded-2xl">{permission.name}</span>

                                            ))
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>




                    </div>
                </div>
            </div>
        </>
        )
    }

export default ShowRoleAndPermission
