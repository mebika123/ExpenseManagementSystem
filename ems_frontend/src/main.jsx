import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './routes/Layout.jsx'
import Login from './routes/auth/Login.jsx'
import Home from './routes/Home.jsx'
import AddUser from './routes/users/AddUser.jsx'
import EditUser from './routes/users/EditUser.jsx'
import AddContact from './routes/conatcts/AddContact.jsx'
import UserList from './routes/users/UserList.jsx'
import { AuthProvider } from "./context/AuthContext";
import Department from './routes/departments/Department.jsx'
import AddBudget from './routes/budgets/AddBudget.jsx'
import Location from './routes/locations/Location.jsx'
import BudgetList from './routes/budgets/BudgetList.jsx'
import EditBudget from './routes/budgets/EditBudget.jsx'
import BudgetDetails from './routes/budgets/BudgetDetails.jsx'
import ExpenseCategory from './routes/expenseCategory/ExpenseCategory.jsx'
import AddExpense from './routes/expenses/AddExpense.jsx'
import EditExpense from './routes/expenses/EditExpense.jsx'
import ExpensesList from './routes/expenses/ExpensesList.jsx'
import ExpenseDetails from './routes/expenses/ExpenseDetails.jsx'
import AddExpensePlan from './routes/expensePlan/AddExpensePlan.jsx'
import ExpensePlanList from './routes/expensePlan/ExpensePlanList.jsx'
import EditExpensePlan from './routes/expensePlan/EditExpensePlan.jsx'
import ExpensePlanDetails from './routes/expensePlan/ExpensePlanDetails.jsx'
import AddRole from './routes/role/AddRole.jsx'
import AddAdvance from './routes/advance/AddAdvance.jsx'
import EditAdvance from './routes/advance/EditAdvance.jsx'
import AdvanceList from './routes/advance/AdvanceList.jsx'
// import TransactionaList from './routes/transactionalLog/TransactionaList.jsx'
import UnSettledTransactions from './routes/transactionalLog/UnSettledTransactions.jsx'
import TransactionalLogs from './routes/transactionalLog/TransactionalLogs.jsx'
import AdvanceSetteled from './routes/advanceSettlement/AdvanceSetteled.jsx'
import Reimbursement from './routes/reimbursement/Reimbursement.jsx'
import UnsettledAdvanceSettlement from './routes/advanceSettlement/UnsettledAdvanceSettlement.jsx'
import UnsettledReimbursement from './routes/reimbursement/UnsettledReimbursement.jsx'
import RoleList from './routes/role/RoleList.jsx'
import Forbidden from './routes/Forbidden.jsx'
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import EditRole from './routes/role/EditRole.jsx'
import Contacts from './routes/conatcts/Contacts.jsx'
import EditContact from './routes/conatcts/EditContact.jsx'
import ExpenseSummary from './routes/report/ExpenseSummary.jsx'

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);



const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  { path: "/403", element: <Forbidden /> },

  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Home /> },

      { path: "/users", element: <UserList /> },
      { path: "/user/new", element: <AddUser /> },
      { path: "/user/edit/:id", element: <EditUser /> },

      { path: "/departments", element: <Department /> },

      { path: "/locations", element: <Location /> },

      { path: "/expense-categories", element: <ExpenseCategory /> },
      { path: "/expenses", element: <ExpensesList /> },
      { path: "/expense/new", element: <AddExpense /> },
      { path: "/expense/edit/:id", element: <EditExpense /> },
      { path: "/expense/details/:id", element: <ExpenseDetails /> },

      { path: "/expense-plan/new", element: <AddExpensePlan /> },
      { path: "/expense-plan/edit/:id", element: <EditExpensePlan /> },
      { path: "/expense-plan/details/:id", element: <ExpensePlanDetails /> },
      { path: "/expense-plan", element: <ExpensePlanList /> },


      { path: "/advance/new", element: <AddAdvance /> },
      { path: "/advance/edit/:id", element: <EditAdvance /> },
      { path: "/advances", element: <AdvanceList /> },

      { path: "/contacts", element: <Contacts /> },
      { path: "/contact/new", element: <AddContact /> },
      { path: "/contact/edit/:id", element: <EditContact /> },

      { path: "/roles", element: <RoleList /> },
      { path: "/role/new", element: <AddRole /> },
      { path: "/role/edit/:id", element: <EditRole /> },
      { path: "/role/details/:id", element: <EditRole /> },

      { path: "/budget-timelines", element: <BudgetList /> },
      { path: "/budget-timeline/new", element: <AddBudget /> },
      { path: "/budget-timeline/edit/:id", element: <EditBudget /> },
      { path: "/budget-timeline/details/:id", element: <BudgetDetails /> },

      { path: "/unsettled/transactional-logs", element: <UnSettledTransactions /> },
      { path: "/transactional-logs", element: <TransactionalLogs /> },

      { path: "/advance-settlements", element: <AdvanceSetteled /> },
      { path: "/advance-settlements/unsettled", element: <UnsettledAdvanceSettlement /> },

      { path: "/reimbursements", element: <Reimbursement /> },
      { path: "/reimbursements/unsettled", element: <UnsettledReimbursement /> },

      { path: "/report/expense-summary", element: <ExpenseSummary /> },

    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>
)
