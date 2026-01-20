import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../axios';

const ExpenseReportForm = ({ form, setForm }) => {
    // const [form, setForm] = useState({
    //     location_id: '',
    //     budgetTimeline_id: '',
    //     expense_category_id: '',
    //     supplier: '',
    //     paid_by_id: '',
    //     start_date: '',
    //     final_date: ''
    // })

    //fetch trackers
    const [departments, setDepartment] = useState([]);
    const [locations, setLocation] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([])
    const [employees, setEmployees] = useState([])
    const [budgetTimelines, setBudgetTimelines] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    locationsRes,
                    departmentsRes,
                    expenseCategoriesRes,
                    suppliersRes,
                    employeesRes,
                    budgetTimelinesRes,
                ] = await Promise.all([
                    axiosInstance.get('/locations'),
                    axiosInstance.get('/departments'),
                    axiosInstance.get('/expenseCategories'),
                    axiosInstance.get('/suppliers'),
                    axiosInstance.get('/employees'),
                    axiosInstance.get('/budgetTimelines')
                ]);


                setLocation(locationsRes.data);
                setDepartment(departmentsRes.data);
                setExpenseCategories(expenseCategoriesRes.data);
                setSuppliers(suppliersRes.data.suppliers);
                setEmployees(employeesRes.data.employees);
                // setBudgetTimelines(budgetTimelinesRes.data.budgetTimelines); //bugetTimeline
                setBudgetTimelines(
                    budgetTimelinesRes.data.budgetTimelines.filter(timeline => timeline.isEditable === false)
                )


            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    return (<>
        <div className="grid md:grid-cols-2 ">
            <div className="flex items-center mt-4 gap-3">
                <div className="font-bold text-sm">Location :</div>
                <div className="">

                    <select
                        className=" rounded-sm border border-[#D1D1D1] p-2"
                        value={form.location_id}
                        onChange={handleChange}
                        name='location_id'>
                        <option value="">Select Location</option>
                        {
                            locations?.map((l, i) => (
                                <option value={l.id}>{l.code}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <div className="flex items-center mt-4 gap-3">
                <div className="font-bold text-sm">Expense Category :</div>
                <div className="">

                    <select
                        className=" rounded-sm border border-[#D1D1D1] p-2"
                        value={form.expense_category_id}
                        onChange={handleChange}
                        name='expense_category_id'>
                        <option value="">Select Expense Category</option>
                        {
                            expenseCategories?.map((expenseCategory, i) => (
                                <option value={expenseCategory.id}>{expenseCategory.code}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <div className="flex items-center mt-4 gap-3">
                <div className="font-bold text-sm">Paid By :</div>
                <div className="">

                    <select
                        className=" rounded-sm border border-[#D1D1D1] p-2"
                        name='paid_by_id'
                        value={form.paid_by_id}
                        onChange={handleChange}
                    >
                        <option value="">Select Paid By</option>
                        <option value="">Company</option>
                        {
                            employees?.map((emp, i) => (
                                <option value={emp.id}>{emp.code}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <div className="flex items-center mt-4 gap-3">
                <div className="font-bold text-sm">Suppliers :</div>
                <div className="">

                    <select
                        className=" rounded-sm border border-[#D1D1D1] p-2"
                        name='supplier'
                        onChange={handleChange}
                        value={form.supplier}>
                        <option value="">Select Suppliers</option>
                        {
                            suppliers?.map((sup, i) => (
                                <option value={sup.id}>{sup.code}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <div className="flex items-center mt-4 gap-3">
                <div className="font-bold text-sm">Budget Timeline :</div>
                <div className="">

                    <select
                        className=" rounded-sm border border-[#D1D1D1] p-2"
                        name='budgetTimeline_id'
                        value={form.budgetTimeline_id}
                        onChange={handleChange}
                    >
                        <option value="">Select Budget Timeline </option>
                        {
                            budgetTimelines?.map((budgetTimeline, i) => (
                                <option value={budgetTimeline.id}>{budgetTimeline.code}</option>
                            ))
                        }
                    </select>
                </div>

            </div>
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center mt-4 gap-3">
                    <div className="font-bold text-sm">From :</div>
                    <div className="">

                        <input type="date" name='start_date' className=" rounded-sm border border-[#D1D1D1] p-2" value={form.start_date} onChange={handleChange}
                        />
                    </div>

                </div>
                <div className="flex items-center mt-4 gap-3">
                    <div className="font-bold text-sm">To :</div>
                    <div className="">

                        <input type="date" name='final_date' className=" rounded-sm border border-[#D1D1D1] p-2" value={form.final_date} onChange={handleChange} />
                    </div>

                </div>

            </div>

        </div>
    </>
    )
}

export default ExpenseReportForm