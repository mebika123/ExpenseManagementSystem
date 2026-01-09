import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import { Link } from 'react-router-dom';

const Reimbursement = () => {

  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchReimbursement = async () => {
      try {
        const res = await axiosInstance.get('/reimbursements');
        setReimbursements(res.data.reimbursements)
      } catch (error) {
        console.error(error)

      }
      finally {
        setLoading(false)
      }
    }
    fetchReimbursement();
  }, [])


  const safeReimbursements = reimbursements ?? [];


  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor(row => row?.amount, { header: "Amount" }),
    columnHelper.accessor(row => row.contact.code, { header: "Contact" }),
    columnHelper.accessor(row => row.amount, { header: "Status" }),
    columnHelper.accessor(row => row?.settlement_date, { header: "Payment Date" }),
  ];
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: safeReimbursements,
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

      <div className="w-full bg-white rounded-md p-7  text-center">

        <h2 className="text-4xl font-bold mb-8 ">Reimbursement</h2>

        <div className="flex justify-end gap-3 ml-10">
          <SearchBar
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <Link to={'/reimbursements/unsettled'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">Settle</Link>



        </div>

        <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
          <table className=" w-full min-w-[700]">
            <thead>
              <tr className="mb-3 border-b ">
                <th className="py-3 px-2">S.N</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Contact</th>
                <th className="py-3 px-2 w-1/5">Settled</th>
                <th className="py-3 px-2">Settlement Date</th>
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
                {table.getRowModel().rows.length > 0 ? (

                  table.getRowModel().rows.map((row, index) => {
                    const reimbursement = row.original;

                    return (<>
                      <tr
                        className='mb-3 even:bg-[#eff7f299] odd:bg-white' >

                        <td className="py-3 px-2">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + index + 1}</td>
                        <td className="py-3 px-2">
                          {reimbursement?.amount}
                        </td>
                        <td className="py-3 px-2">
                          {reimbursement?.contacts?.code}
                        </td>

                        <td className="py-3 px-2">
                          {reimbursement?.transactional_logs?.[0]?.isSettled === 1 ?
                            <span className="text-green-600 bg-green-50 ring-green-500/10">Settled</span>
                            : <span className="text-red-600 bg-red-50 ring-red-500/10">Unsettled</span>
                          }
                        </td>
                        <td className="py-3 px-2">
                          {reimbursement?.settlement_date?.split(' ')[0]}
                        </td>
                      </tr>

                    </>

                    )
                  })
                ) : (
                  <tr className="bg-[#eff7f299]">
                    <td colSpan={7} className="px-4 py-2 text-lg font-semibold">
                      No item listed yet.
                    </td>
                  </tr>
                )}

              </tbody>


            )}

          </table>
          <Pagination table={table} />

        </div>
      </div>

    </div>
  )
}

export default Reimbursement