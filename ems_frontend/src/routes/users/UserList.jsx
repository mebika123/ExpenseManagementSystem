import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { can } from '../../utils/permission';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';

const UserList = () => {
    const { permissions, loading } = useAuth();

    if (!can('user.view', permissions)) return <Navigate to="/403" replace />;


    // const [loading, setLoading] = useState(true);
    const [contactUser, setContactUser] = useState();
    useEffect(() => {
        const fetchContactUsers = async () => {
            try {
                const res = await axiosInstance.get('/users')
                // console.log()
                setContactUser(res.data.user)

            } catch (error) {
                console.log(error)
            }
            finally {
                // setLoading(false);
            }
        }
        fetchContactUsers();
    }, [])
    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axiosInstance.delete(`/users/${userId}`);
            alert('User deleted successfully');
            // Optional: remove from state to update UI
            setContactUser((prev) => prev.filter(c => c.id !== userId));
        } catch (err) {
            console.error(err);
            alert('Failed to delete user');
        }
    };
    //search and pagination

    const safeContactUser = contactUser ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("email", { header: "Email" }),
        columnHelper.accessor(row => row.contact?.code, { header: "Code" }),
        columnHelper.accessor(row => row.contact?.email, { header: "Email" }),
        columnHelper.accessor(row => row.contact?.phone, { header: "Contact No" }),
    ];
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = useReactTable({
        data: safeContactUser,
        columns,
        state: { globalFilter, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (<>
        <div className="w-full p-8 flex justify-center items-center mt-8">

            <div className="w-4/5 bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold  mb-8 ">User List </h2>

                <div className="flex justify-end ml-10 gap-3">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />

                    {
                        can('user.create', permissions) &&

                        <Link to={'/user/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>
                    }

                </div>

                <div className="flex justify-center items-center w-full">
                    <table className=" w-full">
                        <thead>
                            <tr className="mb-3 border-b">
                                <th className="py-3">S.N</th>
                                <th className="py-3">Code</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Contact No</th>
                                {/* <th className="py-3">Department</th> */}
                                <th className="py-3">Action</th>
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
                                    const user = row.original;
                                    return (
                                        <tr className="mb-3 border-b even:bg-[#dce0e1] odd:bg-white">
                                            <td className="py-3">
                                                {table.getState().pagination.pageIndex *
                                                    table.getState().pagination.pageSize +
                                                    index + 1}
                                            </td>
                                            <td className="py-3">{user?.contact?.code || ''}</td>
                                            <td className="py-3">{user?.contact?.name || ''}</td>
                                            <td className="py-3">{user.email}</td>
                                            <td className="py-3">{user?.contact?.phone_no || ''}</td>
                                            <td className="py-3">
                                                <div className="flex gap-4 items-center justify-center">
                                                    {
                                                        can('user.update', permissions) &&
                                                        <Link to={`/user/edit/${user.id}`}>
                                                            <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#32B274]">
                                                                <FontAwesomeIcon icon={faPen} />
                                                            </div>
                                                        </Link>
                                                    }
                                                    {
                                                        can('user.delete', permissions) &&

                                                        <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#FF3641]">
                                                            <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(user.id)} />

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

                </div>
                <Pagination table={table} />
            </div>
        </div >
    </>)
}

export default UserList