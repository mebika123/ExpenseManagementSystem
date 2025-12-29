import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const BudgetList = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [budgetTimelines, setBudgetTimelines] = useState()
    useEffect(() => {
        const fetchBudgetTimeline = async () => {
            try {
                const res = await axiosInstance.get('/budgetTimelines');
                setBudgetTimelines(res.data.budgets);
                console.log(budgetTimelines);
            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchBudgetTimeline();
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Budget Timeline?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/budgetTimelines/${id}`);
            setBudgetTimelines(budgetTimelines?.filter(budgetTimeline => budgetTimeline?.id !== id));
            alert('Budget Timeline deleted successfully!');
        } catch (error) {
            console.error('Failed to delete Budget Timeline:', error);
            alert('Failed to delete Budget Timeline. Please try again.');
        }
    }
    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold uppercase mb-8 ">Budget TimLine List </h2>
                <div className="flex justify-end ml-10">
                    <a href='/budget-timeline/new' className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</a>

                </div>

                <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
                    <table className="w-full min-w-[700]">
                        <thead>
                            <tr className="border-b ">
                                <th className="py-3 px-2">S.N</th>
                                <th className="py-3 px-2">Name</th>
                                <th className="py-3 px-2">Code</th>
                                <th className="py-3 px-2">Start At</th>
                                <th className="py-3 px-2">End At</th>
                                {/* <th className="py-3 px-2">Status</th> */}
                                <th className="py-3 px-2 w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            ) : (

                                budgetTimelines.map((budgetTimeline, index) => (
                                    <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={budgetTimeline.id}>
                                        <td className="py-3 px-2">{index + 1}</td>
                                        <td className="py-3 px-2">{budgetTimeline.name}</td>
                                        <td className="py-3 px-2">{budgetTimeline.code}</td>
                                        <td className="py-3 px-2">{budgetTimeline.start_at}</td>
                                        <td className="py-3 px-2">{budgetTimeline.end_at}</td>
                                        <td className="py-3 px-2">
                                            <div className="flex gap-4 items-center justify-center">
                                                <Link to={`/budget-timeline/details/${budgetTimeline.id}`} ><FontAwesomeIcon icon={faEye} /></Link>
                                                <Link to={`/budget-timeline/edit/${budgetTimeline.id}`}><FontAwesomeIcon icon={faPen} className='text-[#29903B]' /></Link>
                                                <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(budgetTimeline.id)} className='text-[#FF0133]' />
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

export default BudgetList