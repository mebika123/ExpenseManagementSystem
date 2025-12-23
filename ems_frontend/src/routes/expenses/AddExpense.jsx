import React, { useEffect, useState } from 'react'
import ExpenseForm from '../../components/ui/form/ExpenseForm'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../axios';

const AddExpense = () => {
  const { user } = useAuth();
  // //fetch trackers
  // const [departments, setDepartment] = useState([]);
  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     try {
  //       const res = await axiosInstance.get('/departments');
  //       setDepartment(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   };

  //   fetchDepartments();
  // }, []);

  // const [locations, setLocation] = useState([]);
  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     try {
  //       const res = await axiosInstance.get('/locations');
  //       setLocation(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   };

  //   fetchLocations();
  // }, []);

  // const [expenseCategories, setExpenseCategories] = useState([]);
  // useEffect(() => {
  //   const fetchExpenseCategories = async () => {
  //     try {
  //       const res = await axiosInstance.get('/expenseCategories');
  //       setExpenseCategories(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   };

  //   fetchExpenseCategories();
  // }, []);

  // //fetch contants & employee
  // const [contacts, setContacts] = useState()
  // useEffect(() => {
  //   const fetchContacts = async () => {

  //     const res = await axiosInstance.get('/contacts');
  //     console.log("contact")
  //     console(res.data);
  //   }
  //   fetchContacts()
  // }, [])

  // const [employee, setEmployee] = useState()
  // useEffect(() => {
  //   const fetchEmployee = async () => {
  //     const res = await axiosInstance.get('/employee');
  //     console.log("employee")
  //     console(res.data);

  //   }
  //   fetchEmployee()
  // }, [])


  // // fetch budgetTimeline and seleted timeline budget

  // const [budgetTimelines, setBudgetTimelines] = useState()
  // useEffect(() => {
  //   const fetchBudgetTimeline = async () => {
  //     try {
  //       const res = await axiosInstance.get('/budgetTimelines');
  //       setBudgetTimelines(res.data.budgets);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchBudgetTimeline();

  // }, [])
  // const [budget, setBudget] = useState()
  // useEffect(() => {
  //   const fetchBudgets = async () => {
  //           const id = form.budget_timeline_id

  //     try {
  //       const res = await axiosInstance.get(`${id}/budgets`);
  //       setBudget(res.data.budgets);
  //     } catch (error) {
  //       console.log(error)
  //     }
  //     finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchBudgets();

  // }, [])
  return (
    <>
      <ExpenseForm
        id={null}
        title={"New Expense"}
        data = {null}
        />
    </>
  )
}

export default AddExpense