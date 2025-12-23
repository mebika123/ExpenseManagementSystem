import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ExpensesList = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const res = await axiosInstance.get('/expense');
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
    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-4/5 bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold uppercase mb-8 ">Expense List </h2>
                <div className="flex justify-end ml-10">
                    <a className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</a>

                </div>

                <div className="flex justify-center items-center w-full">
                    <table className=" w-full">
                        <thead>
                            <tr className="mb-3 border-b">
                                <th className="py-3">S.N</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Code</th>
                                <th className="py-3">Budget Timeline Code</th>
                                <th className="py-3">Created By</th>
                                <th className="py-3">Status</th>
                                <th className="py-3 w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            ) : (

                                expenses.map((expense, index) => (
                                    <tr className="mb-3 even:bg-[#dce0e1] odd:bg-white" key={expense.id}>
                                        <td className="py-3">{index + 1}</td>
                                        <td className="py-3">{expense.title}</td>
                                        <td className="py-3">{expense.code}</td>
                                        <td className="py-3">{expense.budget_timeline.code}</td>
                                        <td className="py-3">{expense.created_by_id}</td>
                                        <td className="py-3">{expense.latest_status[0].status}</td>
                                        <td className="py-3 w-2/7">
                                            <div className="flex gap-4 items-center justify-center">
                                                <Link to={`/expense/details/${expense.id}`} className='px-4 py-2 bg-[#43c07b]  rounded-lg text-white'>View</Link>
                                                <Link to={`/expense/edit/${expense.id}`} className='px-4 py-2 bg-[#5619fe]  rounded-lg text-white'>Edit</Link>
                                                <button onClick={() => handleDelete(expense.id)} className='px-4 py-2 bg-[#fe1919]  rounded-lg text-white'>Delete</button>
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