import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/form/ModalForm';

import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';


const Location = () => {
    // fetch location
    const [loading, setLoading] = useState(true);
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
    // modal
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);


    //create new location
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
    const openEdit = (location) => {
        setForm({ name: location.name });
        setEditingId(location.id);
        setError({});
        setIsOpen(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError({})
            if (editingId) {
                const res = await axiosInstance.put(`/locations/${editingId}`, form);
                if (res) {
                    alert("Location edited successfully!")
                    setLocation(prev =>
                        prev.map(loc =>
                            loc.id === editingId
                                ? { ...loc, ...form }
                                : loc
                        )
                    );


                }
            } else {
                const res = await axiosInstance.post("/locations", form);
                if (res) {
                    alert("New Location add successfully!")
                    setLocation(prev => [...prev, res.data]);

                }

            }
            setIsOpen(false);



        } catch (err) {
            setError(err.response?.data?.errors || {});
        }
    };




    //detele location
    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this location?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/locations/${id}`);
            setLocation(locations?.filter(location => location?.id !== id));
            alert('Location deleted successfully!');
        } catch (error) {
            console.error('Failed to delete location:', error);
            alert('Failed to delete location. Please try again.');
        }
    }


    const safeLocations = locations ?? [];


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
        data: safeLocations,
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
                title={editingId ? "Edit Location" : "New Location"}
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

                <h2 className="text-4xl font-bold uppercase mb-8 ">Location List </h2>

                <div className="flex justify-end gap-3 ml-10">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <button type='button' className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end" onClick={openAdd}>Add New</button>

                </div>

                <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
                    <table className=" w-full min-w-[700]">
                        <thead>
                            <tr className="mb-3 border-b ">
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
                                    const location = row.original;

                                    return (
                                        <tr
                                            key={location.id}
                                            className="mb-3 even:bg-[#eff7f299] odd:bg-white"
                                        >
                                            <td className="py-3 px-2">
                                                {index + 1}
                                            </td>

                                            <td className="py-3 px-2">{location.name}</td>
                                            <td className="py-3 px-2">{location.code}</td>

                                            <td className="py-3 px-2">
                                                <div className="flex gap-4 items-center justify-center">
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                        onClick={() => openEdit(location)}
                                                        className="text-[#29903B]"
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrashCan}
                                                        onClick={() => handleDelete(location.id)}
                                                        className="text-[#FF0133]"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>



                        )}

                    </table>
                        <Pagination table={table}
                        />
                </div>
            </div>

        </div>
    )
}

export default Location