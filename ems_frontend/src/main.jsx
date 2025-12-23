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


const router = createBrowserRouter([
  { path: "login", element: <Login /> },

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

      { path: "/contact/new", element: <AddContact /> },

      { path: "/budget-timelines", element: <BudgetList /> },
      { path: "/budget-timeline/new", element: <AddBudget /> },
      { path: "/budget-timeline/edit/:id", element: <EditBudget /> },
      { path: "/budget-timeline/details/:id", element: <BudgetDetails /> },
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>
)
