import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const ExpensesList = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const res = await axiosInstance.get('/expenses');
                setExpenses(res.data.expenses);
                console.log(res.data.expenses);
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchExpense();
    }, [])

    const handleDelete = async (id, status) => {
        if (status == 'approved') {
            alert(`Can't delete approved item!`)
            return;

        }
        if (!window.confirm('Are you sure you want to delete this Expense?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/expenses/${id}`);
            setExpenses(expenses?.filter(expense => expense?.id !== id));
            alert('Expenses deleted successfully!');
        } catch (error) {
            console.error('Failed to delete expense:', error);
            alert('Failed to delete expense. Please try again.');
        }
    }

    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold mb-8 ">Expense List </h2>
                <div className="flex justify-end ml-10">
                    <Link to={'/expense/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>

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

                                expenses.map((expense, index) => (
                                    <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={expense.id}>
                                        <td className="py-3 px-2">{index + 1}</td>
                                        <td className="py-3 px-2">{expense.title}</td>
                                        <td className="py-3 px-2">{expense.code}</td>
                                        <td className="py-3 px-2">{expense.budget_timeline.code}</td>
                                        <td className="py-3 px-2">{expense.created_by_id}</td>
                                        <td className="py-3 px-2">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                                 ${expense.latest_status[0].status === 'pending'
                                                    ? 'text-yellow-600 bg-yellow-50 ring-yellow-500/10'
                                                    : expense.latest_status[0].status === 'approved'
                                                        ? 'text-green-600 bg-green-50 ring-green-500/10'
                                                        : expense.latest_status[0].status === 'rejected'
                                                            ? 'text-red-600 bg-red-50 ring-red-500/10'
                                                            : 'text-gray-600 bg-gray-50 ring-gray-500/10'
                                                }`} >
                                                {expense.latest_status[0].status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 w-2/7">
                                            <div className="flex gap-4 items-center justify-center">
                                                <Link to={`/expense/details/${expense.id}`} ><FontAwesomeIcon icon={faEye} /></Link>
                                                {expense?.isEditable &&

                                                    <div className="flex gap-4 items-center justify-center">
                                                        <Link to={`/expense/edit/${expense.id}`}><FontAwesomeIcon icon={faPen} className='text-[#29903B]' /></Link>
                                                        <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(expense.id, expense.latest_status[0].status)} className='text-[#FF0133]' />
                                                    </div>

                                                }

                                            </div>
                                        </td>
                                    </tr>
                                ))


                            )}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>)
}

export default ExpensesList