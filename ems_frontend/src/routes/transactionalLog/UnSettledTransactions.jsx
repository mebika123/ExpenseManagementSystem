import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import SearchBar from '../../components/ui/SearchBar';


const UnSettledTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [advanceWithoutItems, setAdvanceWithoutItems] = useState([]);
    const [contactTransaction, setContactTransactions] = useState([]);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosInstance.get('/transactions/unsettled');
                setTransactions(res.data.transactions)
                setAdvanceWithoutItems(res.data.advWithEPNotI)

                console.log(advanceWithoutItems)
            } catch (error) {
                console.error(error)

            }
            finally {
                setLoading(false)
            }
        }
        fetchTransactions();
    }, [])



    const [selectedTransaction, setSelectedTransaction] = useState([]);

    const handleChange = (e) => {
        const newSelectedId = Number(e.target.value);

        setSelectedTransaction(prev =>
            prev.includes(newSelectedId)
                ? prev.filter(id => id !== newSelectedId)
                : [...prev, newSelectedId]
        );
    };

    const selectAll = () => {
        setSelectedTransaction(prev =>
            prev.length === transactions.length
                ? []
                : transactions.map(t => t.id)
        );
    };
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTransaction(transactions.map(t => t.id));
        } else {
            setSelectedTransaction([]);
        }
    };

    const isInvalidAdvance = (id) => {
        return (
            selectedTransaction.includes(id) &&
            advanceWithoutItems.includes(id)
        );
    };


    const handleLogs = async () => {
        try {
            const res = await axiosInstance.post('/transaction/settle', { ids: selectedTransaction });
            // setContactTransactions(res.data.transactions)

            console.log(res.data.transactions)
        } catch (error) {
            console.error(error)

        }
        finally {
            setLoading(false)
        }
    }
    const safeTransactions = transactions ?? [];


    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor(row => row?.model_type, { header: "From" }),
        columnHelper.accessor(row => row.model.name ?? row.model.purpose, { header: "Title" }),
        columnHelper.accessor(row => row.model.contact.code, { header: "Contact" }),
        columnHelper.accessor(row => row.amount, { header: "Contact" }),
        columnHelper.accessor(row => row.payment_date, { header: "Payment Date" }),
    ];
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data: safeTransactions,
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

                <h2 className="text-4xl font-bold mb-8 ">Unsettled Transactional</h2>

                <div className="flex justify-end gap-3 ml-10">
                    <SearchBar
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />


                </div>

                <div className="w-full mt-3 overflow-x-auto rounded-lg shadow-[0px_1px_4px_rgba(0,0,0,0.16)]">
                    <table className=" w-full min-w-[700]">
                        <thead>
                            <tr className="mb-3 border-b ">
                                <th className="py-3 px-2">
                                    <input type="checkbox" onClick={selectAll} onChange={handleSelectAll}
                                        checked={
                                            transactions.length > 0 &&
                                            selectedTransaction.length === transactions.length
                                        } />
                                </th>
                                <th className="py-3 px-2">S.N</th>
                                <th className="py-3 px-2">From</th>
                                <th className="py-3 px-2">Title</th>
                                <th className="py-3 px-2">Contact</th>
                                <th className="py-3 px-2">Amount</th>
                                <th className="py-3 px-2 w-1/5">Payment Date</th>
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
                                        const transaction = row.original;

                                        return (<>
                                            <tr
                                                className={`mb-3  ${isInvalidAdvance(transaction.id) ? 'bg-yellow-50' : 'even:bg-[#eff7f299] odd:bg-white'
                                                    }`}                                        >
                                                <td className="py-3 px-2">
                                                    <input type="checkbox" value={transaction.id} onChange={handleChange}
                                                        checked={selectedTransaction.includes(transaction.id)} />
                                                </td>
                                                <td className="py-3 px-2">{index + 1}</td>
                                                <td className="py-3 px-2">
                                                    {transaction.model_type === 'App\\Models\\ExpenseItem' ? 'Expense Item' :
                                                        transaction.model_type === 'App\\Models\\Advance' ? 'Advance' :
                                                            transaction.model_type === 'App\\Models\\AdvanceSettlement' ? 'Advance Settlement' :
                                                                transaction.model_type === 'App\\Models\\remibursment' ? 'Remibursment' :
                                                                    transaction.model_type?.split('\\').pop() ?? '—'}
                                                </td>
                                                <td className="py-3 px-2">
                                                    {transaction.model_type === 'App\\Models\\ExpenseItem' ? transaction?.model?.name :
                                                        transaction.model_type === 'App\\Models\\Advance' ? transaction?.model?.purpose : '_'}
                                                </td>
                                                <td className="py-3 px-2">
                                                    {transaction?.contacts == null ? '-' : transaction?.contacts?.code}
                                                </td>
                                                <td className="py-3 px-2">
                                                    {transaction?.amount}
                                                </td>
                                                <td className="py-3 px-2">
                                                    {transaction?.payment_date?.split(' ')[0]}
                                                </td>

                                            </tr>
                                            {isInvalidAdvance(transaction.id) && (
                                                <tr className="bg-yellow-50">
                                                    <td colSpan={7} className="px-4 py-2 text-sm text-yellow-700">
                                                        This advance has no items. Settling may cause an error.
                                                    </td>
                                                </tr>
                                            )}
                                        </>

                                        )
                                    })
                                ) : (
                                    <tr className="bg-[#eff7f299]">
                                        <td colSpan={7} className="px-4 py-2 text-lg font-semibold">
                                            No item to settle.
                                        </td>
                                    </tr>
                                )}

                            </tbody>


                        )}

                    </table>
                    <div className="w-full text-end p-4">
                        <button type='button' className="px-4 py-2 bg-[#32b274]  rounded-lg text-white" onClick={handleLogs}>Settle Transactions</button>
                    </div>

                </div>
            </div>

        </div>
        )
}

export default UnSettledTransactions