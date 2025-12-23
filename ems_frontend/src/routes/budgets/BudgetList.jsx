import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';

const BudgetList = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [budgetTimelines, setBudgetTimelines] = useState()
    useEffect(() => {
        const fetchBudgetTimeline = async () =>{
            try {
                const res = await axiosInstance.get('/budgetTimelines');
                setBudgetTimelines(res.data.budgets);
                console.log(budgetTimelines);
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }
        fetchBudgetTimeline();

    },[])
    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-4/5 bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold uppercase mb-8 ">Budget TimLine List </h2>
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
                                <th className="py-3">Start At</th>
                                <th className="py-3">End At</th>
                                {/* <th className="py-3">Status</th> */}
                                <th className="py-3 w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            ) : (

                                budgetTimelines.map((budgetTimeline, index) => (
                                    <tr className="mb-3 even:bg-[#dce0e1] odd:bg-white" key={budgetTimeline.id}>
                                        <td className="py-3">{index + 1}</td>
                                        <td className="py-3">{budgetTimeline.name}</td>
                                        <td className="py-3">{budgetTimeline.code}</td>
                                        <td className="py-3">{budgetTimeline.start_at}</td>
                                        <td className="py-3">{budgetTimeline.end_at}</td>
                                        <td className="py-3">
                                            <div className="flex gap-4 items-center justify-center">
                                                <Link to={`/budget-timeline/details/${budgetTimeline.id}`} className='px-4 py-2 bg-[#43c07b]  rounded-lg text-white'>View</Link>
                                                <Link to={`/budget-timeline/edit/${budgetTimeline.id}`} className='px-4 py-2 bg-[#5619fe]  rounded-lg text-white'>Edit</Link>
                                                <button onClick={() => handleDelete(budgetTimeline.id)} className='px-4 py-2 bg-[#fe1919]  rounded-lg text-white'>Delete</button>
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