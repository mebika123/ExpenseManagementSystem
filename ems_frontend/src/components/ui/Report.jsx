import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import axiosInstance from "../../axios"

const Report = ({ data, filters }) => {
    console.log(filters)
    if (!data || data.length === 0) {
        return <div className="text-center mt-10">No report data</div>
    }
    const reportData = data.result

    const handleExport = async () => {
        try {
            const params = new URLSearchParams(filters).toString();

            const response = await axiosInstance.get(`/expense-report/export?${params}`, {
                responseType: "blob",
            });


            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            //  filename from the header 
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'expense_report.xlsx'; 
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            if (res) {
                alert(res.data.msg)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7  text-center">
                <div className="flex items-center mb-8">
                    <div className=" w-11/12">
                        <h2 className="text-base font-bold mt-3 ">Expense Summary Report</h2>
                        {/* <div className="text-base font-semibold ">From 2026/01/01 To 2026/01/13</div> */}
                    </div>
                    <div className=" text-end" title="export report" >
                        <FontAwesomeIcon icon={faFileExport} className="text-xl" onClick={handleExport} />
                    </div>
                </div>
                <div className="">
                    <table className="w-full rounded-sm">
                        <thead>
                            <tr className="bg-[#32B274] text-white">
                                <th className="border text-sm font-semibold  border-white p-2">S.N</th>
                                <th className="border text-sm font-semibold  border-white p-2">Title</th>
                                <th className="border text-sm font-semibold  border-white p-2">Code</th>
                                <th className="border text-sm font-semibold  border-white p-2">Budget Timeline Code</th>
                                {/* <th className="border text-sm font-semibold  border-white p-2">Created By</th> */}
                                <th className="border text-sm font-semibold  border-white p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reportData?.map((expense, index) => (
                                    <>

                                        <tr className="">
                                            <td className="border text-sm  border-[#32B274] p-2">
                                                <div className="flex items-center">
                                                    {/* <FontAwesomeIcon icon={faAngleDown} className='mr-5'/>  */}
                                                    <span>{index + 1}</span>
                                                </div>
                                            </td>
                                            <td className="border text-sm  border-[#32B274] p-2">{expense?.title}</td>
                                            <td className="border text-sm  border-[#32B274] p-2">{expense?.code}</td>
                                            <td className="border text-sm  border-[#32B274] p-2">{expense?.budget_code}</td>
                                            {/* <td className="border text-sm  border-[#32B274] p-2">Created By</td> */}
                                            <td className="border text-sm  border-[#32B274] p-2">{expense?.total_amount}</td>
                                        </tr>
                                        {/* nested table */}
                                        <tr>
                                            <td colSpan='6'>
                                                {/* <div className="my-2 ml-2 font-bold text-start">Expense Items</div> */}
                                                <table className="w-full rounded-sm mb-3">
                                                    <thead>
                                                        <tr className="bg-[#e6e4e4]">
                                                            <th className="border text-sm font-semibold  border-white p-2">S.N</th>
                                                            <th className="border text-sm font-semibold  border-white p-2">Item Name</th>
                                                            <th className="border text-sm font-semibold  border-white p-2">Supplier</th>
                                                            <th className="border text-sm font-semibold  border-white p-2">Paid By</th>
                                                            <th className="border text-sm font-semibold  border-white p-2">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            expense?.items?.map((item, index) => (
                                                                <tr className="bg-[#f6f3f3]">
                                                                    <td className="border text-sm  border-[#a7aba9] p-2">
                                                                        <div className="flex items-center">
                                                                            {/* <FontAwesomeIcon icon={faAngleDown} className='mr-5'/>  */}
                                                                            <span>{index + 1}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="border text-sm  border-[#a1aea8] p-2">{item?.name || '-'}</td>
                                                                    <td className="border text-sm  border-[#a1aea8] p-2">{item?.supplier_code || '-'}</td>
                                                                    <td className="border text-sm  border-[#a1aea8] p-2">{item?.employee_code || 'Company'}</td>
                                                                    <td className="border text-sm  border-[#a1aea8] p-2">{item?.amount || '-'}</td>


                                                                </tr>

                                                            ))}
                                                    </tbody>

                                                </table>
                                            </td>

                                        </tr>
                                    </>
                                ))
                            }
                        </tbody>

                    </table>
                </div>

                <div className="border text-sm  border-[#32B274] flex items-center ">
                    <div className="border-r border-[#32B274] font-bold w-1/2 p-2"> Total Expense Sum (Rs)</div>
                    <div className="w-1/2">   {
                                data.totalSum}</div>

                </div>
            </div>

        </div>
    )
}

export default Report