import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../axios';

const AdvanceForm = ({ id, title, data }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        contact_id: "",
        expense_plan_id: "",
        purpose: "",
        amount: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!data || !id) return;


        setForm({
            contact_id: data.contact_id || '',
            expense_plan_id: data.expense_plan_id || '',
            amount: data.amount || '',
            purpose: data.purpose || '',
        });
    }, [data, id]);

    const [contacts, setContacts] = useState([])
    const [expensePlans, setExpensePlans] = useState([])

    useEffect(() => {
        const fetchcontact = async () => {
            const res = await axiosInstance.get('/contacts')
            setContacts(res.data)
        }
        fetchcontact()
    }, [])

    useEffect(() => {
        if (!form.contact_id) return;

        const fetchPlans = async () => {
            const res = await axiosInstance.get(
                "/expense-plans/with-totals",
                { params: { contact_id: form.contact_id } }
            );

            setExpensePlans(res.data);
        };

        fetchPlans();
    }, [form.contact_id])

    const selectedPlan = expensePlans.find(
        (plan) => plan.id === Number(form.expense_plan_id)
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {

            if (id) {
                await axiosInstance.put(`/advances/${id}`, form);
                alert("Advance updated successfully");
            }
            else {

                await axiosInstance.post("/advances", form);
                alert("Advance created successfully");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error(error);
                alert("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="md:w-2/3 bg-white rounded-md p-7  text-center">
                <h2 className="text-4xl font-bold mb-8 ">{title}</h2>
                <div className="flex justify-center items-center">
                    <form className="w-full lg:w-2/3" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <div className="flex gap-3 items-center">
                                <label className="w-40">Select Contact:<span className="text-red-600">*</span></label>
                                <select
                                    name="contact_id"
                                    value={form.contact_id}
                                    onChange={handleChange}
                                    className="w-2/3 p-2 border rounded-md"
                                >
                                    <option value="">Select</option>
                                    {contacts?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.contact_id && (
                                <p className="text-red-500 text-sm ml-40">{errors.contact_id[0]}</p>
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="flex gap-3 items-center">
                                <label className="w-40">Expense Plan:</label>
                                <div className="w-2/3 ">
                                    <select
                                        name="expense_plan_id"
                                        value={form.expense_plan_id}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="">Select</option>
                                        {expensePlans?.map(plans => (
                                            <option key={plans.id} value={plans.id}>{plans.title}</option>
                                        ))}
                                    </select>
                                    {selectedPlan && (
                                        <p className="text-base text-start text-gray-600 whitespace-nowrap mt-2">
                                            Estimated amount: <span className="font-semibold">{selectedPlan.total_amount}</span>
                                        </p>
                                    )}
                                </div>

                            </div>
                            {errors.expense_plan_id && (
                                <p className="text-red-500 text-sm ml-40">{errors.expense_plan_id[0]}</p>
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="flex gap-3 items-center">
                                <label className="w-40">Purpose:<span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="purpose"
                                    value={form.purpose ?? ''}
                                    onChange={handleChange}
                                    className="w-2/3 p-2 border rounded-md"
                                />
                            </div>
                            {errors.purpose && (
                                <p className="text-red-500 text-sm ml-40">{errors.purpose[0]}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="flex gap-3 items-center">
                                <label className="w-40">Amount:<span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    className="w-2/3 p-2 border rounded-md"
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-red-500 text-sm ml-40">{errors.amount[0]}</p>
                            )}
                        </div>


                        <button type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" >Submit</button>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default AdvanceForm