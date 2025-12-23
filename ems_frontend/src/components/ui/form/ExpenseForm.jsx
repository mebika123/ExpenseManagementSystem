import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ExpenseForm = ({ id, title, data }) => {
  const [loading, setLoading] = useState(true)

  // const [formError, setFormError] = useState[{
  //   'title': [],
  //   'budget_timeine_id': [],
  // expense_items: {
  //   'name': '[]',
  //   'description': '[]',
  //   'amount': '[]',
  //   'contact_id': '[]',
  //   'expense_category_id': '[]',
  //   'paid_by_id': '[]',
  //   'department_id': '[]',
  //   'location_id': '[]',
  //   'budget_id': '[]'
  // }
  // }]
  console.log(data)

  const [form, setForm] = useState({
    title: '',
    budget_timeline_id: '',
    expense_items: [
      {
        name: '',
        description: '',
        amount: '',
        contact_id: '',
        expense_category_id: '',
        paid_by_id: '',
        department_id: '',
        location_id: '',
        budget_id: ''
      }
    ]
  }
);
// for edit expense and expense item
  // if (id) {
    useEffect(() => {
      if (data && id) {
        // setForm({
        //   title: data.title,
        //   budget_timeline_id: data.budget_timeline_id,

        //   expense_items: data.expense_items?.map(item => ({
        //     id: item.id||'',
        //     name: item.name || '',
        //     description: item.description || '',
        //     amount: item.amount || '',
        //     contact_id: item.contact_id || '',
        //     expense_category_id: item.expense_category_id || '',
        //     paid_by_id: item.paid_by_id || '',
        //     department_id: item.department_id || '',
        //     location_id: item.location_id || '',
        //     budget_id: item.budget_id || ''

        //   })) || []
        // })
        setForm(data);
      }
    }, [data])
  // }

  const [error, setError] = useState();
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  //
  const addExpenseItemRow = () => {
    setForm({
      ...form,
      expense_items: [
        ...form.expense_items,
        { name: '', description: '', amount: '', contact_id: '', expense_category_id: '', paid_by_id: '', department_id: '', location_id: '', budget_id: '' }
      ]
    });
  };

  const handleRemoveRow = (index) => {
    const newItems = [...form.expense_items];
    newItems.splice(index, 1);
    setForm({ ...form, expense_items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.expense_items];
    updatedItems[index][field] = value;

    setForm({
      ...form,
      expense_items: updatedItems
    });
  };
  const { navigate } = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError({});
      if (id) {
        const res = await axiosInstance.put(`/expense/${id}`, form);

      } else {
        const res = await axiosInstance.post("/expense", form);
      }
      navigate()
    } catch (error) {
      if (error.response?.status === 422) {
        setFormError(error.response.data.errors);
      }
    }
  }


  //fetch trackers
  const [departments, setDepartment] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get('/departments');
        setDepartment(res.data);
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchDepartments();
  }, []);

  const [locations, setLocation] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get('/locations');
        setLocation(res.data);
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchLocations();
  }, []);

  const [expenseCategories, setExpenseCategories] = useState([]);
  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        const res = await axiosInstance.get('/expenseCategories');
        setExpenseCategories(res.data);
      } catch (error) {
        console.error(error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchExpenseCategories();
  }, []);

  //fetch contants & employee
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    const fetchContacts = async () => {

      const res = await axiosInstance.get('/contacts');
      // console.log("contact")
      setContacts(res.data);
    }
    fetchContacts()
  }, [])

  const [employees, setEmployees] = useState([])
  useEffect(() => {
    const fetchEmployee = async () => {
      const res = await axiosInstance.get('/employee');
      setEmployees(res.data);

    }
    fetchEmployee()
  }, [])

  // fetch budgetTimeline and seleted timeline budget
  const [budgetTimelines, setBudgetTimelines] = useState([])
  useEffect(() => {
    const fetchBudgetTimeline = async () => {
      try {
        const res = await axiosInstance.get('/budgetTimelines');
        setBudgetTimelines(res.data.budgets);
      } catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchBudgetTimeline();

  }, [])


  const [budgets, setBudgets] = useState([])
  useEffect(() => {
    const id = form.budget_timeline_id
    if (!id) {
      setBudgets([])
    }
    else {
      const fetchBudgets = async () => {

        try {
          setBudgets([])
          const res = await axiosInstance.get(`${id}/budgets`);
          setBudgets(res.data.budgets);
          // console.log(res.data.budgets);
        } catch (error) {
          console.log(error)
        }
        finally {
          setLoading(false)
        }
      }
      fetchBudgets();

    }
  }, [form.budget_timeline_id])

  // handle delete expense expense_items
    const [deleteExpenseId, setDeleteExpenseId] = useState([]);

    const deleteRow = (id) => {
        setDeleteExpenseId(prev => [...prev, id]);

        const updatedRows = form.expense_items.filter(row => row.id !== id);

        if (updatedRows.length === 0) {
        } else {
        }
    };

  return (
    <div className="w-full p-8 flex justify-center items-center mt-8">
      <div className="w-full bg-white rounded-md p-7  text-center">
        <h2 className="text-4xl font-bold uppercase mb-8 ">{title}</h2>
        <div className="flex justify-center items-center">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-6">
              <div className=" w-1/2 text-start">
                <input type="text"
                  className="w-full p-2 rounded-md border border-[#d5d2d2]"
                  onChange={handleChange}
                  name='title' placeholder='name'
                  value={form.title}
                />
                <p className="text-red-500">
                  {
                    formError.title
                  }
                </p>
              </div>
              <div className="w-1/2 text-start">
                <select
                  className="w-2/3 rounded-sm border border-[#D1D1D1] p-2"
                  name='budget_timeline_id'
                  onChange={handleChange}
                  value={form.budget_timeline_id}>
                  <option value="">Select Budget Timeline</option>
                  {

                    budgetTimelines?.map((budgetTimeline, index) => (
                      <option value={budgetTimeline.id}>{budgetTimeline.name}</option>

                    ))
                  }
                </select>
                <p className="text-red-500">
                  {
                    formError.budget_timeline_id
                  }
                </p>
              </div>
            </div>

            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm p-3 mx-auto mb-4 w-full">
              <h3 className="font-bold text-xl">Expense Items</h3>
              <div className="mt-5">

                <div className="overflow-x-auto  w-full">
                  <table className="whitespace-nowrap w-full mb-5">
                    <tbody>
                      {form.expense_items?.map((row, index) => (<>
                        <tr key={index} className="text  text-center">
                          <td className="p-2 border border-[#989898]">
                            <input
                              type="text"
                              className="w-full p-2 rounded-sm border border-[#989898]"
                              name='name'
                              value={row.name}
                              placeholder='Item Name'
                              onChange={(e) =>
                                handleItemChange(index, 'name', e.target.value)
                              }
                            />
                          </td>


                          <td className="p-2 border border-[#989898]" colSpan='2'>
                            <textarea row='3'
                              name='description'
                              type="text"
                              className="w-full rounded-sm border border-[#989898] p-2"
                              value={row.description}
                              placeholder='Description'
                              onChange={(e) =>
                                handleItemChange(index, 'description', e.target.value)
                              }></textarea>
                            {/* {formError[`expense_items.${index}.description`] && (
                              <small className="text-red-500">
                                {formError[`expense_items.${index}.description`][0]}
                              </small>
                            )} */}
                          </td>
                          <td className="p-2 border border-[#989898]">
                            <input
                              type="text"
                              className="w-full rounded-sm border border-[#989898] p-2"
                              name='amount'
                              value={row.amount}
                              placeholder='Amount'

                              onChange={(e) =>
                                handleItemChange(index, 'amount', e.target.value)
                              }
                            />
                          </td>

                          <td className="p-2 border border-[#989898]">
                            <select
                              className="w-full rounded-sm border border-[#989898] p-2"
                              name='contact_id'
                              value={row.contact_id}
                              onChange={(e) =>
                                handleItemChange(index, 'contact_id', e.target.value)

                              }
                            >
                              <option value="">Select contact</option>
                              {

                                contacts?.map((contact, index) => (
                                  <option value={contact.id}>{contact.name}</option>

                                ))
                              }

                            </select>
                          </td>


                          <td className="p-2 border border-[#989898]" rowSpan='2'>
                              <button
                                type="button"
                                onClick={() => (handleRemoveRow(index))}
                                className="py-1 rounded-lg px-4 bg-red-600 text-white"
                              >
                                Remove
                              </button>
                            
                          </td>
                        </tr>

                        {/* remaining field row */}
                        <tr className="text  text-center border-b-2 border-[#6a6a6a]">
                          <td className="p-2 border border-[#989898]">
                            <select
                              className="w-full rounded-sm border border-[#989898] p-2"
                              value={row.location_id}
                              name='location_id'
                              onChange={(e) =>
                                handleItemChange(index, 'location_id', e.target.value)
                              }
                            >
                              <option value="">Select Location</option>
                              {

                                locations.map((location, index) => (
                                  <option value={location.id}>{location.name}</option>

                                ))
                              }
                            </select>
                          </td>
                          <td className="p-2 border border-[#989898]">
                            <select
                              className="w-full rounded-sm border border-[#989898] p-2"
                              value={row.department_id}
                              name='department_id'
                              onChange={(e) =>
                                handleItemChange(index, 'department_id', e.target.value)
                              }
                            >
                              <option value="">Select department</option>
                              {

                                departments.map((department, index) => (
                                  <option value={department.id}>{department.name}</option>

                                ))
                              }
                            </select>
                          </td>
                          <td className="p-2 border border-[#989898]">
                            <select
                              className="w-full rounded-sm border border-[#989898] p-2"
                              value={row.budget_id}
                              name='budget_id'
                              onChange={(e) =>
                                handleItemChange(index, 'budget_id', e.target.value)
                              }
                            >
                              <option value="">Select budget</option>
                              {

                                budgets.map((budget, index) => (
                                  <option value={budget.id}>{budget.title}</option>

                                ))


                              }
                            </select>
                          </td>
                          <td className="p-2 border border-[#989898]">
                            <select
                              className="w-full rounded-sm border border-[#989898] p-2"
                              name='expense_category_id'
                              value={row.expense_category_id}
                              onChange={(e) =>
                                handleItemChange(index, 'expense_category_id', e.target.value)
                              }
                            >
                              <option value="">Select Expense Category</option>
                              {

                                expenseCategories.map((expenseCategory, index) => (
                                  <option value={expenseCategory.id}>{expenseCategory.title}</option>

                                ))
                              }
                            </select>
                          </td>
                          <td className="p-2 border border-[#989898]">
                            <select
                              className="w-full rounded-sm border border-[#989898] p-2"
                              name='paid_by_id'
                              value={row.paid_by_id}
                              onChange={(e) =>
                                handleItemChange(index, 'paid_by_id', e.target.value)
                              }
                            >
                              <option value="">Select Paid By</option>
                              {

                                employees?.map((employee, index) => (
                                  <option value={employee.id}>{employee.name}</option>

                                ))
                              }
                            </select>
                          </td>
                        </tr>
                      </>
                      ))}
                    </tbody>

                  </table>
                  <div className="flex justify-end w-full">
                    <button type='button' className='bg-blue-700 text-white rounded-sm w-44 p-1 hover:bg-blue-800 transition-all' onClick={addExpenseItemRow}
                    >+Add Another Item</button>
                  </div>

                </div>
              </div>
            </div>

            <div className="mb-6 w-full">
              <button type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" >Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ExpenseForm