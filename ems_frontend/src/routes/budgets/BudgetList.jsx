import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';


const BudgetList = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [budgetTimelines, setBudgetTimelines] = useState()
    useEffect(() => {
        const fetchBudgetTimeline = async () => {
            try {
                const res = await axiosInstance.get('/budgetTimelines');
                setBudgetTimelines(res.data.budgetTimelines);
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

    const safeBudgetTimelines = budgetTimelines ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("name", { header: "Name" }),
        columnHelper.accessor("code", { header: "Code" }),
        columnHelper.accessor("start_at", { header: "Start At" }),
        columnHelper.accessor("end_at", { header: "End At" }),
        columnHelper.accessor("status", { header: "Status" }),
    ];
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = useReactTable({
        data: safeBudgetTimelines,
        columns,
        state: { globalFilter, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


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

                <h2 className="text-4xl font-bold  mb-8 ">Budget Timeline List </h2>
                <div className="flex justify-end ml-10 gap-3">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <Link to={'/budget-timeline/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>

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
                                    const budgetTimeline = row.original;
                                    return (

                                        <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={budgetTimeline.id}>
                                            <td className="py-3 px-2">{index + 1}</td>
                                            <td className="py-3 px-2">{budgetTimeline.name}</td>
                                            <td className="py-3 px-2">{budgetTimeline.code}</td>
                                            <td className="py-3 px-2">{budgetTimeline.start_at}</td>
                                            <td className="py-3 px-2">{budgetTimeline.end_at}</td>
                                            <td className="py-3 px-2">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                                 ${budgetTimeline.latest_status[0].status === 'pending'
                                                        ? 'text-yellow-600 bg-yellow-50 ring-yellow-500/10'
                                                        : budgetTimeline.latest_status[0].status === 'approved'
                                                            ? 'text-green-600 bg-green-50 ring-green-500/10'
                                                            : budgetTimeline.latest_status[0].status === 'rejected'
                                                                ? 'text-red-600 bg-red-50 ring-red-500/10'
                                                                : 'text-[#3F51B6] bg-gray-50 ring-[#626daa]'
                                                    }`} >

                                                    {budgetTimeline.latest_status[0].status === 'pending'
                                                        ? 'Pending'
                                                        : budgetTimeline.latest_status[0].status === 'approved'
                                                            ? 'Approved'
                                                        : budgetTimeline.latest_status[0].status === 'checked'
                                                            ? 'Checked'
                                                            : budgetTimeline.latest_status[0].status === 'rejected'
                                                                ? 'Rejected' : '-'}

                                                </span>
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex gap-4 items-center justify-center">
                                                    <Link to={`/budget-timeline/details/${budgetTimeline.id}`} >
                                                        <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#3F51B6]">
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </div>
                                                    </Link>
                                                    {budgetTimeline?.isEditable &&
                                                        <div className="flex gap-4 items-center justify-center">
                                                            <Link to={`/budget-timeline/edit/${budgetTimeline.id}`}>
                                                                <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#32B274]">
                                                                    <FontAwesomeIcon icon={faPen} />

                                                                </div>

                                                            </Link>
                                                            <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#FF3641]">
                                                                <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(budgetTimeline.id)} />

                                                            </div>
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
                    {/* {table.getPageCount() > 1 && */}
                    <Pagination table={table} />
                    {/* } */}
                </div>
            </div>

        </div>
    )
}

export default BudgetList