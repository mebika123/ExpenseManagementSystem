import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';

const BudgetDetails = () => {
    const { id } = useParams();
    const [loading,setLoading] = useState(true)

    // const [departments, setDepartment] = useState([]);
    // useEffect(() => {
    //     const fetchDepartments = async () => {
    //         try {
    //             const res = await axiosInstance.get('/departments');
    //             setDepartment(res.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //         finally {
    //             setLoading(false)
    //         }
    //     };

    //     fetchDepartments();
    // }, []);

    // const [locations, setLocation] = useState([]);
    // useEffect(() => {
    //     const fetchLocations = async () => {
    //         try {
    //             const res = await axiosInstance.get('/locations');
    //             setLocation(res.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //         finally {
    //             setLoading(false)
    //         }
    //     };

    //     fetchLocations();
    // }, []);

    const [budgetTimeline, setBudgetTimeline] = useState()

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await axiosInstance.get(`/budgetTimelines/${id}`);
                setBudgetTimeline(res.data.budgetTimeline);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchBudgets();
    }, []);

    //delete removed budgets

    const [deleteBudgetId, setDeleteBudgetId] = useState([]);

    const handleChange = (e) => {
        const newBudgetId = e.target.value;

        if (deleteBudgetId.includes(newBudgetId)) {
            const newRemoveBudgetId = deleteBudgetId.filter(id => id !== newBudgetId);
            setDeleteBudgetId(newRemoveBudgetId);
        } else {

            setDeleteBudgetId(prev => [...prev, newBudgetId]);
        }
    };

    
    const deleteSelectedBudget = async (e) => {
        if (!window.confirm('Are you sure you want to delete this department?')) {
            return;
        }

        try {
            const budgetDeleteRes = await axiosInstance.post('/deleteBudgets', {
                ids: deleteBudgetId
            });
            if (budgetDeleteRes) {
                alert('Selected budgets deleted successfully!');
            }
        } catch (error) {

        }
    }

    return (
        <>
            <div className="w-full p-8 flex justify-center items-center mt-8">
                <div className="w-2/3 bg-white rounded-md p-7  text-center">
                    <h2 className="text-4xl font-bold uppercase mb-8 ">Budget Timeline Details</h2>
                    <div className="flex justify-center items-center">
                        <div className="w-full">
                            <div className="mb-6 w-full text-start">
                                <div className="w-6/7 p-2 rounded-md"><strong className='mr-5'>Title :</strong> {budgetTimeline?.name}</div>

                            </div>
                            <div className="flex mb-6 item-center gap-3">
                                <div className="w-1/2">
                                    <div className="flex items-center">
                                        <div className='font-bold'>Code :</div>
                                        <div className="w-1/2  p-2 ">{budgetTimeline?.code}</div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex items-center">
                                        <div className='font-bold'>Start At :</div>
                                        <div className="w-1/2  p-2 ">{budgetTimeline?.start_at}</div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex items-center">
                                        <div className='font-bold'>End At :</div>
                                        <div className="w-1/2  p-2">{budgetTimeline?.end_at}</div>
                                    </div>

                                </div>

                            </div>
                            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm p-3 mx-auto mb-4 w-full">
                                <h3 className="font-bold text-xl">Budget Details</h3>
                                <div className="mt-5">

                                    <div className="overflow-x-auto  w-full">
                                        <table className="whitespace-nowrap w-full">
                                            <thead>
                                                <tr className=''>

                                                    <th className='py-2 border border-[#989898]'>Select</th>
                                                    <th className='py-2 border border-[#989898]'>Title</th>
                                                    <th className='py-2 border border-[#989898] w-1/8'>Amount</th>
                                                    <th className='py-2 border border-[#989898]'>Department</th>
                                                    <th className='py-2 border border-[#989898]'>Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {budgetTimeline?.budget?.map((row, index) => (
                                                    <tr className="text-center" key={index}>
                                                        <td className="p-2 border border-[#989898]">
                                                            <input type="checkbox" value={row.id} onChange={handleChange} />
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <div className="w-full  p-2">{row.title}</div>
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <div className="w-full  p-2">{row.amount}</div>
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <div className="w-full  p-2">{row.department_id}</div>
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <div className="w-full  p-2">{row.location_id}</div>
                                                        </td>

                                                        
                                                    </tr>
                                                ))}
                                            </tbody>

                                        </table>
                                        <div className="w-full flex justify-end">
                                            <button type="button" onClick={deleteSelectedBudget} className="py-1 rounded-lg px-4 bg-red-600 text-white mt-4 text-end">Delete Selected Budgets</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6 w-full justify-end gap-2 flex">
                                <button className="px-4 py-2 bg-[#6bd192]  rounded-lg text-white w-1/5" >Checked</button>
                                <button className="px-4 py-2 bg-[#f72e2e]  rounded-lg text-white w-1/5" >Reject</button>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default BudgetDetails