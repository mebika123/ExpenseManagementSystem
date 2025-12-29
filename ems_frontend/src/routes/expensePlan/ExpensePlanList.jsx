import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';

const ExpensePlanList = () => {
    const [expensesPlans, setExpensesPlan] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const res = await axiosInstance.get('/expensesPlan');
                setExpensesPlan(res.data.expensesPlan);   
                console.log(res.data.expensesPlan);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchExpense();
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Expense Plan?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/expensesPlan/${id}`);
            setExpensesPlan(expensesPlans?.filter(expensePlan => expensePlan?.id !== id));
            alert('Expenses plan deleted successfully!');
        } catch (error) {
            console.error('Failed to delete expense plan:', error);
            alert('Failed to delete expense plan. Please try again.');
        }
    }
    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold mb-8 ">Expense Plan List </h2>
                <div className="flex justify-end ml-10">
                    <Link to={'/expense-plan/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>

                </div>

                <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
                    <table className="w-full min-w-[700]">
                        <thead>
                            <tr className="mb-3 border-b">
                                <th className="py-3 px-2">S.N</th>
                                <th className="py-3 px-2">Name</th>
                                <th className="py-3 px-2">Code</th>
                                <th className="py-3 px-2">Budget Timeline Code</th>
                                <th className="py-3 px-2">Created By</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2 w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            ) : (

                                expensesPlans?.map((expense, index) => (
                                    <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={expense.id}>
                                        <td className="py-3 px-2">{index + 1}</td>
                                        <td className="py-3 px-2">{expense.title}</td>
                                        <td className="py-3 px-2">{expense.code}</td>
                                        <td className="py-3 px-2">{expense.budget_timeline.code}</td>
                                        <td className="py-3 px-2">{expense.created_by_id}</td>
                                        <td className="py-3 px-2">{expense.latest_status[0].status}</td>
                                        <td className="py-3 px-2 w-2/7">
                                            <div className="flex gap-4 items-center justify-center">
                                                <Link to={`/expense-plan/details/${expense.id}`} ><FontAwesomeIcon icon={faEye} /></Link>
                                                <Link to={`/expense-plan/edit/${expense.id}`}><FontAwesomeIcon icon={faPen} className='text-[#29903B]' /></Link>
                                                <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(expense.id)} className='text-[#FF0133]' />

                                            </div>
                                        </td>
                                    </tr>
                                ))


                            )}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}

export default ExpensePlanList