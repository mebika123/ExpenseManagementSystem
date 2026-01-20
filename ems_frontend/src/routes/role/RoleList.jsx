import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import ShowRoleAndPermission from '../../components/ui/ShowRoleAndPermission';

const RoleList = () => {

    const [loading, setLoading] = useState(true);

    const [roles, setRoles] = useState()
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await axiosInstance.get('/roles');
                setRoles(res.data.roles);
                console.log(roles);
            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchRole();
    }, [])

    const safeRoles = roles ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("name", { header: "Name" }),
    ];
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const table = useReactTable({
        data: safeRoles,
        columns,
        state: { globalFilter, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Role?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/roles/${id}`);
            setRoles(roles?.filter(role => role?.id !== id));
            alert('Role deleted successfully!');
        } catch (error) {
            console.error('Failed to delete Role:', error);
            alert('Failed to delete Role. Please try again.');
        }
    }

    const [isOpen,setIsOpen] = useState(false)
    const [id,setId] = useState(false)

    const openDetail=(id)=>{
        setIsOpen(true);
        setId(id);

    }
    return (<>
        <ShowRoleAndPermission
            isOpenDetail={isOpen}
            id={id}
            onCloseDetail={() => setIsOpen(false)}
        />
        <div className="w-full p-8 flex justify-center items-center mt-8">

            <div className="w-full bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold  mb-8 ">Roles Management </h2>
                <div className="flex justify-end ml-10 gap-3">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                    <Link to={'/role/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>

                </div>

                <div className="flex justify-center">

                    <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)] ">
                        <table className="w-full min-w-[700]">
                            <thead>
                                <tr className="border-b ">
                                    <th className="py-3 px-2">S.N</th>
                                    <th className="py-3 px-2">Name</th>
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
                                        const role = row.original;
                                        return (

                                            <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={role.id}>
                                                <td className="py-3 px-2">{index + 1}</td>
                                                <td className="py-3 px-2">{role.name}</td>
                                                <td className="py-3 px-2">
                                                    <div className="flex gap-4 items-center justify-center">
                                                            <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#3F51B6]" onClick={()=>openDetail(role.id)}>
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </div>
                                                        <div className="flex gap-4 items-center justify-center">
                                                            <Link to={`/role/edit/${role.id}`}>
                                                                <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#32B274]">
                                                                    <FontAwesomeIcon icon={faPen} />

                                                                </div>

                                                            </Link>
                                                            <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#FF3641]" onClick={() => handleDelete(role.id)}>
                                                                <FontAwesomeIcon icon={faTrashCan}  />

                                                            </div>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}


                                </tbody>
                            )}

                        </table>
                        <Pagination table={table} />
                    </div>
                </div>
            </div>

        </div>
    </>
    )
}

export default RoleList