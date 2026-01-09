import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import SearchBar from '../../components/ui/SearchBar';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/form/ModalForm';


const Department = () => {
    // modal
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);


    //create new department
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
    const openEdit = (department) => {
        setForm({ name: department.name });
        setEditingId(department.id);
        setError({});
        setIsOpen(true);
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError({})
            if (editingId) {
                const res = await axiosInstance.put(`/departments/${editingId}`, form);
                if (res) {
                    alert("Department edited successfully!")
                    setDepartment(prev =>
                        prev.map(doc =>
                            doc.id === editingId
                                ? { ...doc, ...form }
                                : doc
                        )
                    );
                }

            } else {
                const res = await axiosInstance.post("/departments", form);
                if (res.data) {
                    alert("Department Created Successfully!");
                    setDepartment(prev => [...prev, res.data]);

                }
            }
            setIsOpen(false)


        } catch (err) {
            setError(err.response?.data?.errors || 'Something went wrong');
        }
    }

    // fetch department
    const [loading, setLoading] = useState(true);
    const [departments, setDepartment] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get('/departments');
                setDepartment(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchDepartments();
    }, []);

    //detele department
    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this department?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/departments/${id}`);
            setDepartment(departments?.filter(department => department?.id !== id));
            alert('Department deleted successfully!');
        } catch (error) {
            console.error('Failed to delete department:', error);
            alert('Failed to delete department. Please try again.');
        }
    }

    const safeDepartments = departments ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("name", { header: "Name" }),
        columnHelper.accessor("code", { header: "Code" }),
    ];
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: safeDepartments,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });





    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            
            <Modal isOpen={isOpen}
                title={editingId ? "Edit Department" : "New Department"}
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

                <h2 className="text-4xl font-bold  mb-8 ">Department List </h2>
                <div className="flex justify-end gap-3  items-center ml-10">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter} />
                    <a className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end" onClick={openAdd}>Add New</a>
                </div>

                <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
                    <table className="w-full min-w-[700] ">
                        <thead>
                            <tr className="  border-b">
                                <th className="py-3 px-2">S.N</th>
                                <th className="py-3 px-2">Name</th>
                                <th className="py-3 px-2">Code</th>
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
                                    const department = row.original;
                                    return (
                                        <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={department.id}>
                                            <td className="py-3 px-2">{index + 1}</td>
                                            <td className="py-3 px-2">{department.name}</td>
                                            <td className="py-3 px-2">{department.code}</td>
                                            <td className="py-3 px-2">
                                                <div className="flex gap-4 items-center justify-center">
                                                    <FontAwesomeIcon icon={faPen} className='text-[#29903B]'
                                                        onClick={() => openEdit(department)} />
                                                    <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(department.id)}
                                                        className='text-[#FF0133]' />
                                                </div>
                                            </td>
                                        </tr>

                                    )
                                }
                                )
                                }

                            </tbody>
                        )}

                    </table>
                </div>
            </div>

        </div>
    )
}

export default Department