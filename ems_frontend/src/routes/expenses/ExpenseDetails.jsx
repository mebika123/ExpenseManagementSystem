import React, { useEffect, useState } from 'react'
import AttachmentList from '../../components/ui/AttachmentList'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../../axios'

const ExpenseDetails = () => {
    const { id } = useParams()
    const [expense, setExpense] = useState({});

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const res = await axiosInstance.get(`expense/details/${id}`)
                setExpense(res.data.expense)
            } catch (error) {
                console.log(error)
            }
        }
        fetchExpense();
    }, [])
    const [comment, setComment] = useState('');

    const handleChange = (e) => {
        setComment(e.target.value);
    };

    const changeStatus = async (status) => {
        const payload = [{
            status,
            id: expense.id,
            comment
        }];

        console.log(payload);
    };

    return (
        <>
            <div className="w-full p-8 flex justify-center items-center mt-8">
                <div className="w-full bg-white rounded-md p-7  text-center">
                    <h2 className="text-4xl font-bold uppercase mb-8 ">Expense Details</h2>
                    <div className="flex justify-end ml-10">
                        <Link to={`/expense/edit/${id}`} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Edit</Link>

                    </div>
                    <div className="flex justify-center items-center">
                        <div className="w-full">
                            <div className="mb-6 w-full text-start">
                                <div className="w-6/7 p-2 rounded-md"><strong className='mr-5'>Title :</strong>{expense?.title}</div>

                            </div>
                            <div className="flex mb-6 item-center gap-3">
                                <div className="w-1/2">
                                    <div className="flex items-center gap-3">
                                        <div className='font-bold'>Expense Code:</div>
                                        <div className="">{expense?.code}</div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex items-center gap-3">
                                        <div className='font-bold'>Budget Timeline Code:</div>
                                        <div className="">{expense?.budget_timeline?.code}</div>
                                    </div>

                                </div>

                            </div>
                            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm p-3 mx-auto mb-4 w-full">
                                <h3 className="font-bold text-xl">Expense Details</h3>
                                <div className="mt-5">

                                    <div className="overflow-x-auto  w-full">
                                        <table className="whitespace-nowrap w-full">
                                            <thead>
                                                <tr className=''>

                                                    <th className='py-2 border border-[#989898]'>Name</th>
                                                    <th className='py-2 border border-[#989898] w-1/8'>Amount</th>
                                                    <th className='py-2 border border-[#989898]'>Department</th>
                                                    <th className='py-2 border border-[#989898]'>Location</th>
                                                    <th className='py-2 border border-[#989898]'>Description</th>
                                                    <th className='py-2 border border-[#989898]'>Expense Category</th>
                                                    <th className='py-2 border border-[#989898]'>Budget</th>
                                                    <th className='py-2 border border-[#989898]'>Contact</th>
                                                    <th className='py-2 border border-[#989898]'>Paid By</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    expense?.expense_items?.map((expense_item, index) => (
                                                        <tr className="text-center">
                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.name}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.amount}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.department.code}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.location.code}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.desciption || ''}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.expense_categories.code}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item.budget.title}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item?.contact.code || ''}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_item?.paid_by.code || 'Company'}</div>
                                                            </td>


                                                        </tr>)

                                                    )
                                                }
                                            </tbody>

                                        </table>

                                    </div>
                                </div>
                            </div>

                            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm py-3 px-2 mx-auto mb-4 w-full">
                                <h3 className="font-bold text-xl">Transactional Attachment</h3>
                                <div className="flex gap-2 mt-2 justify-center items-center w-full">
                                    <ul className="mt-3 space-y-1 grid md:grid-cols-2 gap-3 w-full lg:w-4/5">
                                        {
                                            expense?.transactional_attachments?.map((file, index) => (

                                                <li className="w-full">
                                                    <div className="relative">
                                                        <div className="flex border bg-indigo-100 border-gray-300 items-center h-10 rounded-md px-6 shadow-xs shadow-indigo-200/50">
                                                            <a
                                                                href={`http://localhost:8000/storage/${file.path}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-sm text-center truncate"
                                                            >
                                                                {file.filename}
                                                            </a>
                                                        </div>

                                                    </div>
                                                </li>
                                            ))
                                        }

                                    </ul></div>

                            </div>
                            <div className="">
                                <h3 className="font-bold text-xl mb-2">Change Status</h3>
                                <div className="items-end">
                                    <div className="flex items-center gap-2 w-2/5 mb-3">
                                        <label className="w-30 text-start">
                                            Comment
                                        </label>
                                        <textarea row='2'
                                            name='comment'
                                            type="text"
                                            className="flex-1 rounded-sm border p-2 border-[#989898]"
                                            placeholder='comment'
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    <div className="mb-6 w-full  gap-2 flex">
                                        <button type='button' className="px-4 py-2 bg-[#408cb5]  rounded-lg text-white w-28" onClick={() => changeStatus('approved')}>Approved</button>
                                        <button type='button' className="px-4 py-2 bg-[#38bf80]  rounded-lg text-white w-28" onClick={() => changeStatus('checked')}>Checked</button>
                                        <button type='button' className="px-4 py-2 bg-[#f72e2e]  rounded-lg text-white w-28" onClick={() => changeStatus('reject')}>Reject</button>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>)
}

export default ExpenseDetails