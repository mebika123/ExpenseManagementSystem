import { faAddressBook, faAngleDown, faAngleUp, faBuilding, faChartPie, faCoins, faFileInvoiceDollar, faHandHoldingDollar, faHouse, faList, faMoneyBillTransfer, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
    const { user } = useAuth();

    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (menuKey) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }))
    }

    return (
        <>
            <aside className="w-1/7 py-1 bg-white h-screen fixed left-0 top-0 bottom-0 flex flex-col">
                <div className="shadow-sm py-3 shrink-0">
                    <div className="font-bold text-2xl px-3 text-shadow-md ml-12">EMS</div>

                </div>
                <ul className='mt-6 px-4 flex-1 overflow-y-auto  sidebar-scroll'>
                    <li className='mb-3 '>
                        <Link to={'/dashboard'}>
                            <div className="text-base font-medium flex items-center gap-5">
                                <FontAwesomeIcon icon={faHouse} />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    </li>

                    <li className='mb-3 '>
                        <div className="text-base font-medium">
                            {/* <div className=' text-xs  text-gray-400'>Contacts </div> */}
                            <div className="">
                                <ul className="  pt-2">
                                    <li className="mb-3" >
                                        <div className="text-base font-medium" onClick={() => toggleMenu('budget_timeline')}>
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faChartPie} />
                                                <div>
                                                    Budget Timeline
                                                    <FontAwesomeIcon icon={openMenus.user ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            openMenus.budget_timeline && (
                                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                                    <li className="ml-12">
                                                        <Link to="/budget-timelines">Timeline List</Link>
                                                    </li>
                                                    <li className="ml-12 mt-2">
                                                        <Link to="/budget-timeline/new">New Timeline</Link>
                                                    </li>
                                                </ul>

                                            )
                                        }
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </li>
                    <li className='mb-3 '>
                        <div className="text-lg font-medium">
                            <div className=' text-xs mt-5  text-gray-400'>Tracker </div>
                            <div className="">
                                <ul className="  pt-2">
                                    <li className="mb-3">
                                        <div className="text-base font-medium">
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faBuilding} />
                                                <Link to={'/departments'}>
                                                    Department
                                                </Link>
                                            </div>
                                        </div>

                                    </li>
                                    <li className="mb-3">
                                        <div className="text-base font-medium">
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faAddressBook} />
                                                <Link to={'/locations'}>
                                                    Location
                                                </Link>
                                            </div>
                                        </div>

                                    </li>
                                    <li className="mb-3">
                                        <div className="text-base font-medium">
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faList} />
                                                <Link to={'/expense-categories'}>
                                                    Expense Category
                                                </Link>
                                            </div>
                                        </div>

                                    </li>

                                </ul>
                            </div>
                        </div>
                    </li>
                    <li className='mb-3 '>
                        <div className="text-base font-medium">
                            <div className=' text-xs  text-gray-400 mt-5'>Expense </div>
                            <div className="">
                                <ul className="  pt-2">
                                    <li className="mb-3">
                                        <div className="text-base font-medium" onClick={() => toggleMenu('expense')}>
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faCoins} />
                                                <div>
                                                    Expense
                                                    <FontAwesomeIcon icon={openMenus.user ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            openMenus.expense && (
                                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                                    <li className="ml-6">
                                                        <Link to="/expenses">Expenses List</Link>
                                                    </li>
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/expense/new">New Expense</Link>
                                                    </li>
                                                </ul>

                                            )
                                        }
                                    </li>
                                    <li className="mb-3">
                                        <div className="text-base font-medium" onClick={() => toggleMenu('expense_plan')} >
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                                                <div>
                                                    Expense Plan
                                                    <FontAwesomeIcon icon={openMenus.contacts ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            openMenus.expense_plan && (
                                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/expense-plan">Expense Plan List</Link>
                                                    </li>
                                                    <li className="ml-6">
                                                        <Link to="/expense-plan/new">New Expense Plan</Link>
                                                    </li>
                                                </ul>

                                            )
                                        }
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </li>
                    <li className='mb-3 '>
                        <div className="text-base font-medium">
                            <div className=' text-xs  text-gray-400 mt-5'>Monetary </div>
                            <div className="">
                                <ul className="  pt-2">
                                    <li className="mb-3">
                                        <div className="text-base font-medium" onClick={() => toggleMenu('advance')}>
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faHandHoldingDollar} />
                                                <div>
                                                    Advances
                                                    <FontAwesomeIcon icon={openMenus.user ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            openMenus.advance && (
                                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                                    <li className="ml-6">
                                                        <Link to="/advances">Advance List</Link>
                                                    </li>
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/advance/new">New Advance</Link>
                                                    </li>
                                                </ul>

                                            )
                                        }
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </li>
                    <li className="mb-3">
                        <div className="text-base font-medium" onClick={() => toggleMenu('transactions')}>
                            <div className="flex items-center gap-5">
                                <FontAwesomeIcon icon={faMoneyBillTransfer} />
                                <div>
                                    Transactions
                                    <FontAwesomeIcon icon={openMenus.transactions ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                </div>
                            </div>
                        </div>
                        {
                            openMenus.transactions && (
                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                    <li className="ml-6">
                                        <Link to="/transactional-logs">Transactional Logs</Link>
                                    </li>
                                    <li className="ml-6 mt-2">
                                        <Link to="/unsettled/transactional-logs">Unsetteled Transactions</Link>
                                    </li>
                                    <li className="ml-6 mt-2">
                                        <Link to="/reimbursements">Reimbursment</Link>
                                    </li>
                                    <li className="ml-6 mt-2">
                                        <Link to="/advance-settlements">Advance Settelment</Link>
                                    </li>
                                </ul>

                            )
                        }
                    </li>
                    <li className='mb-3 '>
                        <div className="text-base font-medium">
                            <div className=' text-xs  text-gray-400 mt-5'>Contacts </div>
                            <div className="">
                                <ul className="  pt-2">
                                    <li className="mb-3">
                                        <div className="text-base font-medium" onClick={() => toggleMenu('user')} >
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faUser} />
                                                <div>
                                                    Users
                                                    <FontAwesomeIcon icon={openMenus.user ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            openMenus.user && (
                                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                                    <li className="ml-6">
                                                        <Link to="/users">Users</Link>
                                                    </li>
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/user/new">New Users</Link>
                                                    </li>
                                                </ul>

                                            )
                                        }
                                    </li>
                                    <li className="mb-3">
                                        <div className="text-base font-medium" onClick={() => toggleMenu('contacts')}>
                                            <div className="flex items-center gap-5">
                                                <FontAwesomeIcon icon={faAddressBook} />
                                                <div>
                                                    Contacts
                                                    <FontAwesomeIcon icon={openMenus.contacts ? faAngleDown : faAngleUp} className='ml-4 text-sm' />
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            openMenus.contacts && (
                                                <ul className="ml-3 mt-4 border-l font-base text-gray-500 border-gray-400 mb-5">
                                                    <li className="ml-6">
                                                        <Link to="/contact/new">New Contacts</Link>
                                                    </li>
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/users/new">Employee</Link>
                                                    </li>
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/users/new">Supplier</Link>
                                                    </li>
                                                </ul>

                                            )
                                        }
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </li>


                </ul>
            </aside>
        </>)
}

export default Sidebar