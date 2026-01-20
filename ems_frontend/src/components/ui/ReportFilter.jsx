import React, { useState } from 'react'
import axiosInstance from '../../axios';
import ExpenseReportForm from './form/ExpenseReportForm'

const ReportFilter = ({ onReportGenerated, setFilters }) => {
    const [form, setForm] = useState({
        location_id: '',
        budgetTimeline_id: '',
        expense_category_id: '',
        supplier: '',
        paid_by_id: '',
        start_date: '',
        final_date: ''
    });

    const handleSubmit = async () => {
        try {
            const res = await axiosInstance.post('/expense-summary-report', form);

            onReportGenerated(res.data.report)   
            // console.log(res.data)   

            setFilters(form)
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold mb-8 ">Expense Summary Report</h2>
                <div className="w-full">
                    <div className="font-bold text-start mb-3">
                        Filter By
                    </div>

                    <ExpenseReportForm form={form} setForm={setForm} />
                </div>
                <div className="mt-5 text-end">
                    <button type="button" className='px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white' onClick={handleSubmit}>Generate Report</button>
                </div>
            </div>

        </div>)
}

export default ReportFilter