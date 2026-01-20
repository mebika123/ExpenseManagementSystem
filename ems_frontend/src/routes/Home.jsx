import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from '../components/ui/DashboardCard';
import BarChart from '../components/ui/charts/BarChart';
import DoughnutChart from '../components/ui/charts/DoughnutChart';
import axiosInstance from '../axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { loading } = useAuth();
  const [dashboardData, setDashboardData] = useState()
  // useEffect(() => {
  //   const fetchDashboardata = async () => {
  //     try {
  //       const res = await axiosInstance.get('/dashboardData');
  //       setDashboardData(res.data);
  //       // console.log(res.data);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //     finally {
  //       // setLoading(false)
  //     }
  //   }
  //   fetchDashboardata();
  // }, [])
  // console.log('Recent Expenses:', dashboardData.expensestbl);

  const [cards, setCards] = useState([]);
  const [bar, setBar] = useState([]);
  const [doughnut, setDoughnut] = useState([]);
  const [table, setTable] = useState([]);

  useEffect(() => {
    axiosInstance.get('/dashboard/cards').then(res => setCards(res.data));
    axiosInstance.get('/dashboard/bar').then(res => setBar(res.data));
    axiosInstance.get('/dashboard/doughnut').then(res => setDoughnut(res.data));
    axiosInstance.get('/dashboard/expenses').then(res => setTable(res.data));
  }, []);
  // console.log('Recent Expenses:', cards);
  // console.log('Recent bar:', bar);
  // console.log('Recent doughnut:', doughnut);
  // console.log('Recent tabel:', table);

  return (
    <>
      <div className="w-full p-8 flex justify-center items-center mt-8">
        <div className="w-full bg-white rounded-md p-7  text-center">
          <div className="text-start w-full">
            <h2 className="text-4xl font-bold  mb-8 ">Dashboard </h2>
          </div>
          <div className="grid gap-5 items-stretch md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title={'Total Expense Transaction'}
              amount={cards.find(c => c.type === "Expense")?.total_amount || 0} />
            <DashboardCard
              title={'Total Advance Transaction'}
              amount={cards.find(c => c.type === "Advance")?.total_amount || 0} />
            <DashboardCard
              title={'Total Advance Settled'}
              amount={cards.find(c => c.type ==="Advance Settlement")?.total_amount || 0} />
            <DashboardCard
              title={'Total Reimbursement'}
              amount={cards.find(c => c.type ==="Reimbursement")?.total_amount || 0} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 mt-9 lg:gap-2P xl:gap-10">
            <div className="lg:col-span-2  p-7 rounded-xl shadow-sm shadow-indigo-500/50">
              <div className="text-start font-semibold text-xl mb-4">Monthly Expense</div>
              <div className="">
                <BarChart bardata={bar} />
              </div>
            </div>
            <div className="rounded-xl p-3 shadow-sm shadow-indigo-500/50 w-full">
              <div className="text-start font-semibold text-xl mb-4">Report</div>
              <div className="flex justify-center">
                <DoughnutChart doughnutData={doughnut} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2  p-7 rounded-xl shadow-sm shadow-indigo-500/50">
            <div className="flex justify-between items-center mb-4">
              <div className="text-start font-semibold text-xl">Recent Expense</div>
              <Link to={'/expenses'} className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end">See All</Link>
            </div>
            <div className="">
              <table className="w-full min-w-[700] border border-gray-500 rounded-xl">
                <thead>
                  <tr className="mb-3 border-b">
                    <th className="py-3 px-2">S.N</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Code</th>
                    <th className="py-3 px-2">Budget Timeline Code</th>
                    <th className="py-3 px-2">Created By</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>

                  {

                    table?.map((expense, index) => (
                      <tr className="mb-3 even:bg-[#eff7f299] odd:bg-white" key={expense.id}>
                        <td className="py-3 px-2">{index + 1}</td>
                        <td className="py-3 px-2">{expense.title}</td>
                        <td className="py-3 px-2">{expense.code}</td>
                        <td className="py-3 px-2">{expense.budget_timeline.code}</td>
                        <td className="py-3 px-2">{expense?.created_by?.code}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium
                                                 ${expense.latest_status[0].status === 'pending'
                              ? 'text-yellow-600 bg-yellow-50 ring-yellow-500/10'
                              : expense.latest_status[0].status === 'approved'
                                ? 'text-green-600 bg-green-50 ring-green-500/10'
                                : expense.latest_status[0].status === 'rejected'
                                  ? 'text-red-600 bg-red-50 ring-red-500/10'
                                  : 'text-gray-600 bg-gray-50 ring-gray-500/10'
                            }`} >
                            {expense.latest_status[0].status}
                          </span>
                        </td>

                      </tr>
                    ))


                  }
                </tbody>

              </table>
            </div>
          </div>


          {/* <div className="grid grid-cols-1 lg:grid-cols-3 mt-9 lg:gap-2P xl:gap-10">
            
            <div className="rounded-xl p-3 shadow-sm shadow-indigo-500/50 w-full">
              <div className="flex justify-center items-center">
                <h3 className=" font-semibold text-3xl mb-4">Welcome {user}</h3>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>)
}

export default Home