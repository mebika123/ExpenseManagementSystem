import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from '../../axios';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/form/ModalForm';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { can } from '../../utils/permission';
import { useAuth } from '../../context/AuthContext';


const ExpenseCategory = () => {
    const { permissions } = useAuth();

    // modal
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const openModal = () => setIsOpen(true);

    //create new expense category
    const [form, setForm] = useState({ name: '' });

    const [error, setError] = useState(null)
    const [formError, setFormError] = useState({ name: [] })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const openAdd = () => {
        setForm({ name: "" });
        setEditingId(null);
        setError({});
        setIsOpen(true);
    };
    const openEdit = (expense_category) => {
        setForm({ name: expense_category.name });
        setEditingId(expense_category.id);
        setError({});
        setIsOpen(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError({})
            if (editingId) {
                const res = await axiosInstance.put(`/expenseCategories/${editingId}`, form);
                if (res.data) {
                    alert("Expense Category Edited Successfully!");
                    setExpenseCategories(prev => prev.map(expCategory => expCategory.id == editingId ? { ...expCategory, ...form } : expCategory))
                }

            } else {
                const res = await axiosInstance.post("/expenseCategories", form);
                if (res.data) {
                    alert("Expense Category Created Successfully!");
                    setExpenseCategories(prev => [...prev, res.data])
                }
            }
            setIsOpen(false)
        } catch (err) {
            setError(err.response?.data?.errors || 'Something went wrong');
        }
    }

    // fetch category
    const [loading, setLoading] = useState(true);
    const [expenseCategories, setExpenseCategories] = useState([]);
    useEffect(() => {
        const fetchExpenseCategories = async () => {
            try {
                const res = await axiosInstance.get('/expenseCategories');
                setExpenseCategories(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchExpenseCategories();
    }, []);

    //detele category
    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this Expense Category?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/departments/${id}`);
            setExpenseCategories(expenseCategories?.filter(expenseCategory => expenseCategory?.id !== id));
            alert('Expense Category deleted successfully!');
        } catch (error) {
            console.error('Failed to delete Expense Category:', error);
            alert('Failed to delete Expense Category. Please try again.');
        }
    }

    const safeExpenseCategories = expenseCategories ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("name", { header: "Name" }),
        columnHelper.accessor("code", { header: "Code" }),
    ];
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: safeExpenseCategories,
        columns,
        state: {
            globalFilter,
            pagination,

        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });





    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <Modal isOpen={isOpen}
                title={editingId ? "Edit Expense Category" : "New Expense Category"}
                onClose={() => setIsOpen(false)}>
                <ModalForm
                    form={form}
                    errors={error}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitText={editingId ? "Update" : "Save"}
                />
            </Modal>

            <div className="w-4/5 bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold  mb-8 ">Expense Categories List </h2>
                <div className="flex justify-end ml-10 gap-4">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <button type='button' className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end" onClick={openAdd}>Add New</button>

                </div>

                <div className="flex justify-center items-center w-full">
                    <table className=" w-full">
                        <thead>
                            <tr className="mb-3 border-b">
                                <th className="py-3">S.N</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Code</th>
                                <th className="py-3 w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            ) : (

                                expenseCategories.map((expenseCategory, index) => (
                                    <tr className="mb-3" key={expenseCategory.id}>
                                        <td className="py-3">
                                            {table.getState().pagination.pageIndex *
                                                table.getState().pagination.pageSize +
                                                index + 1}
                                        </td>
                                        <td className="py-3">{expenseCategory.name}</td>
                                        <td className="py-3">{expenseCategory.code}</td>
                                        <td className="py-3 px-2">
                                            <div className="flex gap-4 items-center justify-center">
                                                {can('expense_category.update', permissions) &&
                                                    <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#32B274]" onClick={() => openEdit(expenseCategory)}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPen}
                                                        />
                                                    </div>
                                                }
                                                {can('expense_category.delete', permissions) &&
                                                    <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#FF0133]" onClick={() => handleDelete(expenseCategory.id)}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrashCan}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))


                            )}
                        </tbody>

                    </table>
                </div>
                <Pagination table={table} />
            </div>

        </div>
    )
}

export default ExpenseCategory