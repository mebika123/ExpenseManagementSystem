import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link, Navigate } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';
import { can } from '../../utils/permission';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/ui/Pagination';

const ExpensePlanList = () => {


    const { permissions } = useAuth();

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

    const safeExpensesPlans = expensesPlans ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("title", { header: "Title" }),
        columnHelper.accessor("code", { header: "Code" }),
        columnHelper.accessor(row => row.budget_timeline?.code, { header: "Budget Timeline Code" }),
        columnHelper.accessor(row => row.created_by?.email, { header: "Created By" }),
        columnHelper.accessor(row => row.latest_status?.[0]?.status, { header: "Status" }),
    ];
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = useReactTable({
        data: safeExpensesPlans,
        columns,
        state: { globalFilter, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold mb-8 ">Expense Plan List </h2>

                <div className="flex justify-end ml-10 gap-3">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />

                    {
                        can('expense.create', permissions) &&
                        <Link to={'/expense-plan/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>

                    }

                </div>

                <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
                    <table className="w-full min-w-[700]">
                        <thead>
                            <tr className="mb-3 border-b">
                                <th className="py-3 px-2">S.N</th>
                                <th className="py-3 px-2">Title</th>
                                <th className="py-3 px-2">Code</th>
                                <th className="py-3 px-2">Budget Timeline Code</th>
                                <th className="py-3 px-2">Created By</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2 w-1/5">Action</th>
                            </tr>
                        </thead>

                        {loading ? (
                            <tbody>
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>

                                {table.getRowModel().rows.map((row, index) => {
                                    const expense = row.original;
                                    return (
                                        <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={expense.id}>
                                            <td className="py-3 px-2">
                                                {table.getState().pagination.pageIndex *
                                                    table.getState().pagination.pageSize +
                                                    index + 1}
                                            </td>
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
                                                    }`} >{expense.latest_status[0].status}</span></td>
                                            <td className="py-3 px-2 w-2/7">
                                                <div className="flex gap-4 items-center justify-center">
                                                    {can('expense_plan.view', permissions) &&
                                                        <Link to={`/expense-plan/details/${expense.id}`} >
                                                            <div className="p-2 bg-[#3F3FF2]  rounded-lg text-white text-end">
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </div>
                                                        </Link>
                                                    }
                                                    {expense?.isEditable &&
                                                        <div className="flex gap-4 items-center justify-center">
                                                            {can('expense_plan.edit', permissions) &&
                                                                <Link to={`/expense-plan/edit/${expense.id}`}>
                                                                    <div className="p-2 bg-[#32B274]  rounded-lg text-white text-end">
                                                                        <FontAwesomeIcon icon={faPen} />
                                                                    </div>
                                                                </Link>
                                                            }
                                                            {can('expense_plan.delete', permissions) &&
                                                                <div className="p-2 bg-[#f72e2e]  rounded-lg text-white text-end" onClick={() => handleDelete(expense.id)} >
                                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}


                            </tbody>
                        )}

                    </table>
                    < Pagination table={table} />
                </div>
            </div>

        </div>
    )
}

export default ExpensePlanList