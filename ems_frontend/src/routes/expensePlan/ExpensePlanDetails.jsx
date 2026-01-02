import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axios';

const ExpensePlanDetails = () => {
    const { id } = useParams()
    const [expensePlan, setExpensePlan] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const fetchExpensePlan = async () => {
            try {
                const res = await axiosInstance.get(`expensePlan/details/${id}`)
                setExpensePlan(res.data.expensePlan)
            } catch (error) {
                console.log(error)
            }
        }
        fetchExpensePlan();
    }, [])

    const generateExpense = () => {
        navigate('/expense/new', {
            state: { 
                expense_plan_id: id
            }
        });

    }

    return (
        <>
            <div className="w-full p-8 flex justify-center items-center mt-8">
                <div className="w-full bg-white rounded-md p-7  text-center">
                    <h2 className="text-4xl font-bold uppercase mb-8 ">Expense Details</h2>
                    <div className="flex justify-end ml-10">
                        <Link to={`/expense-plan/edit/${id}`} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Edit</Link>

                    </div>
                    <div className="flex justify-center items-center">
                        <div className="w-full">
                            <div className="grid lg:grid-cols-2 mb-2">
                                <div className="text-start mb-4"><strong className='mr-5'>Title :</strong>{expensePlan?.title}</div>
                                <div className=" flex item-center gap-10 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className='font-bold'>Start At:</div>
                                        <div className="">{expensePlan?.start_at}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className='font-bold'>End At:</div>
                                        <div className="">{expensePlan?.end_at}</div>
                                    </div>
                                </div>
                                <div className=" mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className='font-bold'>Expense Code:</div>
                                        <div className="">{expensePlan?.code}</div>
                                    </div>
                                </div>
                                <div className=" mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className='font-bold'>Budget Timeline Code:</div>
                                        <div className="">{expensePlan?.budget_timeline?.code}</div>
                                    </div>

                                </div>
                            </div>


                            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm p-3 mx-auto mb-4 w-full">
                                <h3 className="font-bold text-xl">Expense Plan Details</h3>
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
                                                    expensePlan?.expense_plan_items?.map((expense_plan_item, index) => (
                                                        <tr className="text-center">
                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.name}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.amount}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.department.code}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.location.code}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.desciption ?? ''}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.expense_categories?.code}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.budget?.title}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.contact?.code ?? ''}</div>
                                                            </td>

                                                            <td className="p-2 border border-[#989898]">
                                                                <div className="w-full  p-2">{expense_plan_item?.paid_by?.code ?? 'Company'}</div>
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
                                            expensePlan?.transactional_attachments?.map((file, index) => (

                                                <li className="w-full">
                                                    <div className="relative">
                                                        <div className="flex border border-gray-300 items-center h-10 rounded-md px-6 shadow-xs shadow-indigo-200/50">
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
                            <div className="mb-6 w-full justify-end gap-2 flex">
                                <button className="px-4 py-2 bg-[#6bd192]  rounded-lg text-white w-1/5" >Checked</button>
                                <button className="px-4 py-2 bg-[#f72e2e]  rounded-lg text-white w-1/5" >Reject</button>
                            </div>
                            <div className="mb-6 w-full justify-end gap-2 flex">
                                <button className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/5" onClick={generateExpense}>Genrate Expense</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>)
}

export default ExpensePlanDetails