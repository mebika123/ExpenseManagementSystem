import { faAddressBook, faAngleDown, faAngleUp, faBuilding, faChartPie, faCoins, faFileInvoice, faFileInvoiceDollar, faHandHoldingDollar, faHouse, faList, faMoneyBillTransfer, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { can, canAny } from '../../utils/permission'

const Sidebar = () => {
    const { user, permissions } = useAuth();

    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (menuKey) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }))
    }
    // console.log(permissions)
    console.log(canAny([
        'expense.view',
        'expense.create',
        'expense_plan.view',
        'expense_plan.create'
    ]))

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

                    {(can('budgetTimeline.create', permissions) || can('budgetTimeline.view', permissions)) &&
                        (

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
                        )

                    }
                    {(can('department.create', permissions) || can('department.view', permissions) || can('location.create', permissions) || can('location.view', permissions) || can('expense_category.create', permissions) || can('expense_category.view', permissions)) && (

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
                    )

                    }

                    {/* {(can('expense.create', permissions) || can('expense.view', permissions)||can('expense_plan.create', permissions) || can('expense_plan.view', permissions)) &&
                        (
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

                        )} */}
                    {canAny([
                        'expense.view',
                        'expense.create',
                        'expense_plan.view',
                        'expense_plan.create'
                    ],
                        permissions) && (
                            <li className="mb-3">
                                <div className="text-xs text-gray-400 mt-5">Expense</div>

                                {/* Expense */}
                                {canAny(['expense.view', 'expense.create'], permissions) && (
                                    <div className="mt-2">
                                        <div
                                            className="flex items-center gap-5 cursor-pointer text-base font-medium"
                                            onClick={() => toggleMenu('expense')}
                                        >
                                            <FontAwesomeIcon icon={faCoins} />
                                            <span>
                                                Expense
                                                <FontAwesomeIcon
                                                    icon={openMenus.expense ? faAngleDown : faAngleUp}
                                                    className="ml-4 text-sm"
                                                />
                                            </span>
                                        </div>

                                        {openMenus.expense && (
                                            <ul className="ml-3 mt-4 border-l text-gray-500 border-gray-400">
                                                {can('expense.view', permissions) && (
                                                    <li className="ml-6"> <Link to="/expenses">Expenses List</Link> </li>
                                                )}
                                                {can('expense.create', permissions) && (
                                                    <li className="ml-6 mt-2"> <Link to="/expense/new">New Expense</Link> </li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                )}

                                {/* Expense Plan */}
                                {canAny(['expense_plan.view', 'expense_plan.create'],
                                    permissions) && (
                                        <div className="mt-4">
                                            <div
                                                className="flex items-center gap-5 text-base font-medium cursor-pointer"
                                                onClick={() => toggleMenu('expense_plan')}
                                            >
                                                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                                                <span>
                                                    Expense Plan
                                                    <FontAwesomeIcon
                                                        icon={openMenus.expense_plan ? faAngleDown : faAngleUp}
                                                        className="ml-4 text-sm"
                                                    />
                                                </span>
                                            </div>

                                            {openMenus.expense_plan && (
                                                <ul className="ml-3 mt-4 border-l text-gray-500 border-gray-400">
                                                    {can('expense_plan.view', permissions) && (
                                                        <li className="ml-6"> <Link to="/expense-plan">Expense Plan List</Link> </li>
                                                    )}
                                                    {can('expense_plan.create', permissions) && (
                                                        <li className="ml-6 mt-2"> <Link to="/expense-plan/new">New Expense Plan</Link> </li>
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                            </li>
                        )}


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


                    {(can('transactional_log.settle', permissions) || can('transactional_log.view', permissions)) &&
                        (

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
                        )}

                    <li className='mb-3 '>
                        <div className="text-base font-medium">
                            <div className=' text-xs  text-gray-400 mt-5'>Report </div>
                            <div className="">
                                <ul className="  pt-2">
                                    <li className="mb-3">
                                        <div className="text-base font-medium">
                                            <Link to={'/report/expense-summary'}>
                                                <div className="flex items-center gap-5">
                                                    <FontAwesomeIcon icon={faFileInvoice} />
                                                    <div>
                                                        Expense Summary
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                    </li>

                                </ul>
                            </div>
                        </div>
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
                                                    <li className="ml-6 mt-2">
                                                        <Link to="/roles">Roles</Link>
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
                                                        <Link to="/contacts">Contacts</Link>
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