import React, { use, useEffect, useState } from 'react'
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faL, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ModalAdvanceDetails from '../../components/ui/ModalAdvanceDetails';


const AdvanceList = () => {
  const [advances, setAdvances] = useState([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchadvances = async () => {
      try {
        const res = await axiosInstance.get(`/advances`)
        setAdvances(res.data.advances)

      } catch (error) {
        console.error(error)
      }
      finally {
        setLoading(false)
      }

    }
    fetchadvances()
  }, [])

  const safeAdvances = advances ?? [];


  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor(row => row.contact?.code, { header: "Contact" }),
    columnHelper.accessor("purpose", { header: "Purpose" }),
    columnHelper.accessor("amount", { header: "Amount" }),
    columnHelper.accessor(row => row.expense_plan?.title, { header: "Expense Plan" }),
    columnHelper.accessor(row => row.latest_status?.[0]?.status, { header: "Status" }),
  ];

  const [globalFilter, setGlobalFilter] = useState("");

  console.log(safeAdvances)
  const table = useReactTable({
    data: safeAdvances,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/advances/${id}`);
      setAdvances(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const [isOpenDetail, setIsOpenDetail] = useState(false)
  const [viewId, setViewId] = useState('')

  const openViewModal = (id) => {
    setViewId(id)
    setIsOpenDetail(true)

  }

  return (
    <div className="w-full p-8 flex justify-center items-center mt-8">
      <ModalAdvanceDetails
        isOpenDetail={isOpenDetail}
        onCloseDetail={() => {
          setIsOpenDetail(false);
          setViewId('');
        }}
        id={viewId}
      />

      <div className="w-full bg-white rounded-md p-7  text-center">

        <h2 className="text-4xl font-bold  mb-8 ">Advance List </h2>

        <div className="flex justify-end gap-3 ml-10">
          <SearchBar
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <Link to={'/advance/new'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Add New</Link>

        </div>

        <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
          <table className=" w-full min-w-[700]">
            <thead>
              <tr className="mb-3 border-b ">
                <th className="py-3 px-2">S.N</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Purpose</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Expense Plan</th>
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
                  const advance = row.original;

                  return (
                    <tr
                      key={advance.id}
                      className="mb-3 even:bg-[#eff7f299] odd:bg-white"
                    >
                      <td className="py-3 px-2">
                        {table.getState().pagination.pageIndex *
                          table.getState().pagination.pageSize +
                          index +
                          1}
                      </td>

                      <td className="py-3 px-2">{advance?.contact?.code}</td>
                      <td className="py-3 px-2">{advance?.purpose}</td>
                      <td className="py-3 px-2">{advance?.amount}</td>
                      <td className="py-3 px-2">{advance?.expense_plan?.title}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                                 ${advance?.latest_status[0]?.status === 'pending'
                            ? 'text-yellow-600 bg-yellow-50 ring-yellow-500/10'
                            : advance?.latest_status[0]?.status === 'approved'
                              ? 'text-green-600 bg-green-50 ring-green-500/10'
                              : advance?.latest_status[0]?.status === 'rejected'
                                ? 'text-red-600 bg-red-50 ring-red-500/10'
                                : 'text-gray-600 bg-gray-50 ring-gray-500/10'
                          }`} >{advance?.latest_status?.[0]?.status}
                        </span></td>

                      <td className="py-3 px-2">
                        <div className="flex gap-4 items-center justify-center">
                          <FontAwesomeIcon icon={faEye} onClick={() => openViewModal(advance.id)} />

                          {advance?.isEditable &&
                            <div className="flex gap-4 items-center justify-center">
                              <Link to={`/advance/edit/${advance.id}`}>
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="text-[#29903B]"
                                />
                              </Link>
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                onClick={() => handleDelete(advance.id)}
                                className="text-[#FF0133]"
                              />
                            </div>}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>



            )}

          </table>
        </div>
      </div>

    </div>)
}

export default AdvanceList