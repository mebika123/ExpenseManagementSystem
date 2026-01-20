import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { can } from '../../utils/permission';


const AddBudget = () => {
    const [loading, setLoading] = useState(true)


    const [budget, setBudget] = useState([{ title: '', amount: '', department_id: '', location_id: '', }]);

    const [form, setForm] = useState({
        name: '',
        start_at: '',
        end_at: '',
        budget: [
            { title: '', amount: '', department_id: '', location_id: '' }
        ]
    });

        const { permissions} = useAuth();

    // if (loading) {
    //     return <div>Loading...</div>; // or spinner
    // }

    if (!can('budgetTimeline.create', permissions)) return <Navigate to="/403" replace />;

    const [departments, setDepartment] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get('/departments');
                setDepartment(res.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchDepartments();
    }, []);

    const [locations, setLocation] = useState([]);
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axiosInstance.get('/locations');
                setLocation(res.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchLocations();
    }, []);

    const [error, setError] = useState(null)
    const [formError, setFormError] = useState({
        name: [],
        start_at: [],
        end_at: [],
        title: [],
        amount: [],
        department_id: [],
        location_id: [],
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const addBudgetRow = () => {
        setBudget([...budget, { title: '', amount: '', department_id: '', location_id: '' }])
    }

    const handleBudgetChange = (index, field, value) => {
        const newBudget = [...budget];
        newBudget[index][field] = value;
        setBudget(newBudget);
    }
    const { navigate } = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, budget };
            const res = await axiosInstance.post('/budgetTimelines', payload);

            if (res.data) {
                alert("Budget Timeline Created!")
                navigate('/budget-timelines')
            }

        } catch (err) {
            const errors = err.response?.data?.errors || {};
            setFormError(err.response?.data?.errors);
            console.log(formError)
            setError(err.response?.data?.message || 'Something went wrong');
        }


    }

    return (
        <>
            <div className="w-full p-8 flex justify-center items-center mt-8">
                <div className="w-2/3 bg-white rounded-md p-7  text-center">
                    <h2 className="text-4xl font-bold  mb-8 ">New Budget Timeline </h2>
                    <div className="flex justify-center items-center">
                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="mb-6 w-full text-start">
                                <input type="text" className="w-6/7 p-2 rounded-md border border-[#D1D1D1]" name='name' placeholder='name' value={form.name} onChange={handleChange} />
                                <p className="text-red-500">
                                    {
                                        formError.name[0]
                                    }
                                </p>
                            </div>
                            <div className="flex mb-6 item-center gap-3">
                                <div className="w-1/2">
                                    <div className="flex gap-3 items-center">
                                        <label htmlFor="start_at" className=''>Start At</label>
                                        <input type="date" className="w-2/3  p-2 rounded-md border border-[#D1D1D1]" name='start_at' placeholder='Start at' value={form.start_at} onChange={handleChange} />
                                    </div>
                                    <p className="text-red-500">
                                        {
                                            formError.start_at[0]
                                        }
                                    </p>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex gap-3 items-center">
                                        <label htmlFor="end_at" className=''>End At</label>
                                        <input type="date" className="w-2/3 p-2 rounded-md border border-[#D1D1D1]" name='end_at' placeholder='End at' value={form.end_at} onChange={handleChange} />
                                    </div>
                                    <p className="text-red-500">
                                        {
                                            formError.end_at[0]
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm p-3 mx-auto mb-4 w-full">
                                <h3 className="font-bold text-xl">Add Budget</h3>
                                <div className="mt-5">

                                    <div className="overflow-x-auto  w-full">
                                        <table className="whitespace-nowrap w-full mb-5">
                                            <thead>
                                                <tr className=''>
                                                    <th className='py-2 border border-[#989898]'>Title <span className="text-md text-red-500">*</span></th>
                                                    <th className='py-2 border border-[#989898] w-1/8'>Amount <span className="text-md text-red-500">*</span></th>
                                                    <th className='py-2 border border-[#989898]'>Department <span className="text-md text-red-500">*</span></th>
                                                    <th className='py-2 border border-[#989898]'>Location <span className="text-md text-red-500">*</span></th>
                                                    <th className='py-2 border border-[#989898]'>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {budget.map((row, index) => (
                                                    <tr key={index} className="text-center">
                                                        <td className="p-2 border border-[#989898]">
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 rounded-sm border border-[#989898]"
                                                                value={row.title}
                                                                onChange={(e) =>
                                                                    handleBudgetChange(index, 'title', e.target.value)
                                                                }
                                                            />
                                                            {formError[`budget.${index}.title`] && (
                                                                <p className="text-red-500">
                                                                    {formError[`budget.${index}.title`][0]}
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <input
                                                                type="text"
                                                                className="w-full rounded-sm border border-[#989898] p-2"
                                                                value={row.amount}
                                                                onChange={(e) =>
                                                                    handleBudgetChange(index, 'amount', e.target.value)
                                                                }
                                                            />
                                                            {formError[`budget.${index}.amount`] && (
                                                                <p className="text-red-500">
                                                                    {formError[`budget.${index}.amount`][0]}
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <select
                                                                className="w-full rounded-sm border border-[#989898] p-2"
                                                                value={row.department_id}
                                                                onChange={(e) =>
                                                                    handleBudgetChange(index, 'department_id', e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select Department</option>
                                                                {

                                                                    departments.map((department, index) => (
                                                                        <option value={department.id}>{department.name}</option>

                                                                    ))
                                                                }

                                                            </select>

                                                            {formError[`budget.${index}.department_id`] && (
                                                                <p className="text-red-500">
                                                                    {formError[`budget.${index}.department_id`][0]}
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            <select
                                                                className="w-full rounded-sm border border-[#989898] p-2"
                                                                value={row.location_id}
                                                                onChange={(e) =>
                                                                    handleBudgetChange(index, 'location_id', e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select Location</option>
                                                                {

                                                                    locations.map((location, index) => (
                                                                        <option value={location.id}>{location.name}</option>

                                                                    ))
                                                                }
                                                            </select>
                                                            {formError[`budget.${index}.location_id`] && (
                                                                <p className="text-red-500">
                                                                    {formError[`budget.${index}.location_id`][0]}
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="p-2 border border-[#989898]">
                                                            {
                                                                index != 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setBudget(budget.filter((_, i) => i !== index))
                                                                        }
                                                                        className="py-1 rounded-lg px-4 bg-red-600 text-white"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>


                                        </table>
                                        <div className="flex justify-end w-full">
                                            <button type='button' className='bg-blue-700 text-white rounded-sm w-44 p-1 hover:bg-blue-800 transition-all'
                                                onClick={addBudgetRow}
                                            >+Add Another Budget</button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 w-full">
                                <input type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddBudget