import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
// import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './routes/Layout.jsx'
import Login from './routes/auth/Login.jsx'

const Home = lazy(() => import('./routes/Home.jsx'))
const AddUser = lazy(() => import('./routes/users/AddUser.jsx'))
const EditUser = lazy(() => import('./routes/users/EditUser.jsx'))
const AddContact = lazy(() => import('./routes/conatcts/AddContact.jsx'))
const UserList = lazy(() => import('./routes/users/UserList.jsx'))
const Department = lazy(() => import('./routes/departments/Department.jsx'))
const AddBudget = lazy(() => import('./routes/budgets/AddBudget.jsx'))
const Location = lazy(() => import('./routes/locations/Location.jsx'))
const BudgetList = lazy(() => import('./routes/budgets/BudgetList.jsx'))
const EditBudget = lazy(() => import('./routes/budgets/EditBudget.jsx'))
const BudgetDetails = lazy(() => import('./routes/budgets/BudgetDetails.jsx'))
const ExpenseCategory = lazy(() => import('./routes/expenseCategory/ExpenseCategory.jsx'))
const AddExpense = lazy(() => import('./routes/expenses/AddExpense.jsx'))
const EditExpense = lazy(() => import('./routes/expenses/EditExpense.jsx'))
const ExpensesList = lazy(() => import('./routes/expenses/ExpensesList.jsx'))
const ExpenseDetails = lazy(() => import('./routes/expenses/ExpenseDetails.jsx'))
const AddExpensePlan = lazy(() => import('./routes/expensePlan/AddExpensePlan.jsx'))
const ExpensePlanList = lazy(() => import('./routes/expensePlan/ExpensePlanList.jsx'))
const EditExpensePlan = lazy(() => import('./routes/expensePlan/EditExpensePlan.jsx'))
const ExpensePlanDetails = lazy(() => import('./routes/expensePlan/ExpensePlanDetails.jsx'))
const AddRole = lazy(() => import('./routes/role/AddRole.jsx'))
const AddAdvance = lazy(() => import('./routes/advance/AddAdvance.jsx'))
const EditAdvance = lazy(() => import('./routes/advance/EditAdvance.jsx'))
const AdvanceList = lazy(() => import('./routes/advance/AdvanceList.jsx'))
// import TransactionaList from './routes/transactionalLog/TransactionaList.jsx'
const UnSettledTransactions = lazy(() => import('./routes/transactionalLog/UnSettledTransactions.jsx'))
const TransactionalLogs = lazy(() => import('./routes/transactionalLog/TransactionalLogs.jsx'))
const AdvanceSetteled = lazy(() => import('./routes/advanceSettlement/AdvanceSetteled.jsx'))
const Reimbursement = lazy(() => import('./routes/reimbursement/Reimbursement.jsx'))
const UnsettledAdvanceSettlement = lazy(() => import('./routes/advanceSettlement/UnsettledAdvanceSettlement.jsx'))
const UnsettledReimbursement = lazy(() => import('./routes/reimbursement/UnsettledReimbursement.jsx'))
const RoleList = lazy(() => import('./routes/role/RoleList.jsx'))
const Forbidden = lazy(() => import('./routes/Forbidden.jsx'))
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
import ProtectedRoute from './ProtectedRoute.jsx'

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


const withSuspense = (Component) => (
  <Suspense fallback={<div className="loading">Loading...</div>}>
    <Component />
  </Suspense>
)

const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  { path: "/403", element: <Forbidden /> },

  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/dashboard", element: withSuspense(Home) },
      { path: "/", element: withSuspense(Home) },

      {
        path: "/users", element:
          <ProtectedRoute permission="user.view" >
            {withSuspense(UserList)}
          </ProtectedRoute>
      },
      {
        path: "/user/new", element:
          <ProtectedRoute permission="user.create" >
            {withSuspense(AddUser)}
          </ProtectedRoute>
      },
      {
        path: "/user/edit/:id", element:
          <ProtectedRoute permission="user.update" >
            {withSuspense(EditUser)}
          </ProtectedRoute>
      },

      {
        path: "/departments", element:
          <ProtectedRoute permission="department.view" >
            {withSuspense(Department)}
          </ProtectedRoute>
      },

      {
        path: "/locations", element:
          < ProtectedRoute permission="location.view" >
            {withSuspense(Location)}
          </ProtectedRoute >
      },

      {
        path: "/expense-categories", element:
          <ProtectedRoute permission="expenseCategory.view" >
            {withSuspense(ExpenseCategory)}
          </ProtectedRoute>
      },
      {
        path: "/expenses", element:
          <ProtectedRoute permission="expense.view" >
            {withSuspense(ExpensesList)}
          </ProtectedRoute>
      },
      {
        path: "/expense/new", element:
          <ProtectedRoute permission="expense.create" >
            {withSuspense(AddExpense)}
          </ProtectedRoute>
      },
      {
        path: "/expense/edit/:id", element:
          <ProtectedRoute permission="expense.update" >
            {withSuspense(EditExpense)}
          </ProtectedRoute>
      },
      {
        path: "/expense/details/:id", element:
          <ProtectedRoute permission="expense.show" >
            {withSuspense(ExpenseDetails)}
          </ProtectedRoute>
      },

      {
        path: "/expense-plan/new", element:
          <ProtectedRoute permission="expensePlan.create" >
            {withSuspense(AddExpensePlan)}
          </ProtectedRoute>
      },
      {
        path: "/expense-plan/edit/:id", element:
          <ProtectedRoute permission="expensePlan.update" >
            {withSuspense(EditExpensePlan)}
          </ProtectedRoute>
      },
      {
        path: "/expense-plan/details/:id", element:
          <ProtectedRoute permission="expensePlan.show" >
            {withSuspense(ExpensePlanDetails)}
          </ProtectedRoute>
      },
      {
        path: "/expense-plan", element:
          <ProtectedRoute permission="expensePlan.view" >
            {withSuspense(ExpensePlanList)}
          </ProtectedRoute>
      },


      {
        path: "/advance/new", element:
          <ProtectedRoute permission="advance.create" >
            {withSuspense(AddAdvance)}
          </ProtectedRoute>
      },
      {
        path: "/advance/edit/:id", element:
          <ProtectedRoute permission="advance.update" >
            {withSuspense(EditAdvance)}
          </ProtectedRoute>
      },
      {
        path: "/advances", element:
          <ProtectedRoute permission="advance.view" >
            {withSuspense(AdvanceList)}
          </ProtectedRoute>
      },

      {
        path: "/contacts", element:
          <ProtectedRoute permission="contact.view" >
            {withSuspense(Contacts)}
          </ProtectedRoute>
      },
      {
        path: "/contact/new", element:
          <ProtectedRoute permission="contact.create" >
            {withSuspense(AddContact)}
          </ProtectedRoute>
      },
      {
        path: "/contact/edit/:id", element:
          <ProtectedRoute permission="contact.update" >
            {withSuspense(EditContact)}
          </ProtectedRoute>
      },

      {
        path: "/roles", element:
          <ProtectedRoute permission="role.view" >
            {withSuspense(RoleList)}
          </ProtectedRoute>
      },
      {
        path: "/role/new", element:
          <ProtectedRoute permission="role.create" >
            {withSuspense(AddRole)}
          </ProtectedRoute>
      },
      {
        path: "/role/edit/:id", element:
          <ProtectedRoute permission="role.update" >
            {withSuspense(EditRole)}
          </ProtectedRoute>
      },
      {
        path: "/role/details/:id", element:
          <ProtectedRoute permission="role.show" >
            {withSuspense(EditRole)}
          </ProtectedRoute>
      },

      {
        path: "/budget-timelines", element:
          <ProtectedRoute permission="budgetTimeline.view" >
            {withSuspense(BudgetList)}
          </ProtectedRoute>
      },
      {
        path: "/budget-timeline/new", element:
          <ProtectedRoute permission="budgetTimeline.create" >
            {withSuspense(AddBudget)}
          </ProtectedRoute>
      },
      {
        path: "/budget-timeline/edit/:id", element:
          <ProtectedRoute permission="budgetTimeline.update" >
            {withSuspense(EditBudget)}
          </ProtectedRoute>
      },
      {
        path: "/budget-timeline/details/:id", element:
          <ProtectedRoute permission="budgetTimeline.show" >
            {withSuspense(BudgetDetails)}
          </ProtectedRoute>
      },

      {
        path: "/unsettled/transactional-logs", element:
          <ProtectedRoute permission="transactional_log.unsettled.view" >
            {withSuspense(UnSettledTransactions)}
          </ProtectedRoute>
      },
      {
        path: "/transactional-logs", element:
          <ProtectedRoute permission="transactional_log.view" >
            {withSuspense(TransactionalLogs)}
          </ProtectedRoute>
      },

      { path: "/advance-settlements", element: <AdvanceSetteled /> },
      {
        path: "/advance-settlements/unsettled", element:
          <ProtectedRoute permission="advance_settlement.update" >
              {withSuspense(UnsettledAdvanceSettlement)}
          </ProtectedRoute>
      },

      {
        path: "/reimbursements", element:
          <ProtectedRoute permission="reimbursement.view" >
            {withSuspense(Reimbursement)}
          </ProtectedRoute>
      },
      {
        path: "/reimbursements/unsettled", element:
          <ProtectedRoute permission="reimbursement.update" >
            {withSuspense(UnsettledReimbursement)}
          </ProtectedRoute>
      },

      {
        path: "/report/expense-summary", element:

          < ProtectedRoute permission="report.view" >
            {withSuspense(ExpenseSummary)}
          </ProtectedRoute >

      },

    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>
)
