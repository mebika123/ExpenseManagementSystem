import React, { useEffect, useRef, useState } from 'react'
import axiosInstance from '../../../axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faXmark } from '@fortawesome/free-solid-svg-icons';
import AttachmentList from '../AttachmentList';

const ExpenseForm = ({ title, data, type, id }) => {
  const [loading, setLoading] = useState(true)

  const location = useLocation();
  const expense_plan_id = location.state?.expense_plan_id;



  const emptyExpenseItem = {
    name: '',
    description: '',
    amount: '',
    contact_id: '',
    expense_category_id: '',
    paid_by_id: '',
    department_id: '',
    location_id: '',
    budget_id: '',
    expense_plan_item_id: ''
  };

  const [form, setForm] = useState({
    title: '',
    budget_timeline_id: '',
    purpose: '',
    expense_plan_id: '',
    start_at: '',
    end_at: '',
    expense_items: [{ ...emptyExpenseItem }]
  });

  const [existingFiles, setExistingFiles] = useState([])


  const isExpensePlan = type === 'expensePlan';

  const itemsKey = isExpensePlan
    ? 'expense_plan_items'
    : 'expense_items';

  useEffect(() => {
    if (!data) return;

    const items = data[itemsKey] || [];

    setForm({
      ...data,
      expense_items: items.length ? items : [{ ...emptyExpenseItem }],
      transactional_attachments: [{}],
    });

    setExistingFiles(data.transactional_attachments || []);
  }, [data, id, type]);



  useEffect(() => {
    if (!expense_plan_id) return
    const fetchExpensePlan = async () => {
      const res = await axiosInstance.get(`expensePlan/details/${expense_plan_id}`)
      const expensePlan = res.data.expensePlan

      setForm({
        title: expensePlan.title,
        budget_timeline_id: expensePlan.budget_timeline_id,
        expense_plan_id: expensePlan.id,
        expense_items: expensePlan.expense_plan_items?.map(item => ({
          expense_plan_item_id: item.id,
          name: item.name,
          description: item.description,
          amount: item.amount,
          contact_id: item.contact_id,
          expense_category_id: item.expense_category_id,
          paid_by_id: item.paid_by_id,
          department_id: item.department_id,
          location_id: item.location_id,
          budget_id: item.budget_id
        })) ?? [{ ...emptyExpenseItem }]

      });
      // console.log(form)
      setExistingFiles(expensePlan.transactional_attachments || []);

    }
    fetchExpensePlan()

  }, [expense_plan_id]);



  const [error, setError] = useState();
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  //
  const addExpenseItemRow = () => {
    setForm(prev => ({
      ...prev,
      expense_items: [...prev.expense_items, { ...emptyExpenseItem }]
    }));
  };



  const handleRemoveRow = (index) => {
    setForm(prev => {
      const updatedItems = prev.expense_items.filter((_, i) => i !== index);

      return {
        ...prev,
        expense_items:
          updatedItems.length > 0
            ? updatedItems
            : [{ ...emptyExpenseItem }]
      };
    });
  };


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.expense_items];
    updatedItems[index][field] = value;

    setForm({
      ...form,
      expense_items: updatedItems
    });
  };




  //fetch trackers
  const [departments, setDepartment] = useState([]);
  const [locations, setLocation] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [contacts, setContacts] = useState([])
  const [employees, setEmployees] = useState([])
  const [budgetTimelines, setBudgetTimelines] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          locationsRes,
          departmentsRes,
          expenseCategoriesRes,
          contactsRes,
          employeesRes,
          budgetTimelinesRes,
        ] = await Promise.all([
          axiosInstance.get('/locations'),
          axiosInstance.get('/departments'),
          axiosInstance.get('/expenseCategories'),
          axiosInstance.get('/contacts'),
          axiosInstance.get('/contacts'),
          axiosInstance.get('/budgetTimelines')
        ]);


        setLocation(locationsRes.data);
        setDepartment(departmentsRes.data);
        setExpenseCategories(expenseCategoriesRes.data);
        setContacts(contactsRes.data);
        setEmployees(employeesRes.data);
        setBudgetTimelines(budgetTimelinesRes.data.budgets); //bugetTimeline


      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
  };

  //attachment js
  const hiddenFileInput = useRef(null);

  const handleClick = () => hiddenFileInput.current.click();

  const [attachments, setAttachments] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...selectedFiles]);
  };
  // Remove selected image before upload
  const removeExistingFile = (id) => {
    setExistingFiles(existingFiles.filter(file => file.id !== id));
  };

  const removeImage = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  //handle form submit
  const handleSubmit = async (e) => {

    console.log(type)
    e.preventDefault();
    try {
      setFormError({});
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('budget_timeline_id', form.budget_timeline_id);
      if (form.expense_plan_id) {
        formData.append('expense_plan_id', form.expense_plan_id);
      }

      attachments.forEach((file) => {
        formData.append('attachments[]', file);
      })
      existingFiles.forEach(file => formData.append("existingFiles[]", file.id));

      //expense

      if (type == 'expense') {

        form.expense_items.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            formData.append(`expense_items[${index}][${key}]`, item[key]);
          });
        });

        if (id) {
          formData.append('_method', 'PUT');

          if (deleteExpenseId.length > 0) {
            try {
              const deleteExpenseItemsRes = await axiosInstance.post('/deleteExpenseItems', {
                ids: deleteExpenseId
              });

              if (deleteExpenseItemsRes.status !== 200) {
                alert("Failed to delete selected expense items.");
                return;
              }
            } catch (err) {
              alert("Error deleting expense items.");
              return;
            }
          }

          try {
            const res = await axiosInstance.post(`/expenses/${id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
              alert("Expense has been updated successfully");
              navigate('/expenses');
            }
          } catch (error) {
            if (error.response?.status === 422) {
              setFormError(error.response.data.errors);
            } else {
              alert("Error updating expense.");
            }
          }
        } else {
          const res = await axiosInstance.post("/expenses", formData);
          if (res) {
            alert("Expense has been created successfully")
            navigate('/expenses')
          }

          console.log(formError)
        }
      }
      else if (type == 'expensePlan') { //expense plan

        form.expense_items.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            formData.append(`expense_plan_items[${index}][${key}]`, item[key]);
          });
        });
        formData.append('purpose', form.purpose);
        formData.append('start_at', form.start_at);
        formData.append('end_at', form.end_at);

        if (id) {
          formData.append('_method', 'PUT');

          if (deleteExpenseId.length > 0) {
            try {
              const deleteExpenseItemsRes = await axiosInstance.post('/deleteExpensePlanItems', {
                ids: deleteExpenseId
              });

              if (deleteExpenseItemsRes.status !== 200) {
                alert("Failed to delete selected expense plan items.");
                return;
              }
            } catch (err) {
              alert("Error deleting expense plan items.");
              return;
            }
          }

          try {
            const res = await axiosInstance.post(`/expensesPlan/${id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.status === 200) {
              alert("Expense plan has been updated successfully");
              navigate('/expenses');
            }
          } catch (error) {
            if (error.response?.status === 422) {
              setFormError(error.response.data.errors);
            } else {
              alert("Error updating expense.");
            }
          }
        } else {

          try {

            const res = await axiosInstance.post("/expensesPlan", formData);
            if (res) {
              alert("Expense Plan has been created successfully")
              navigate('/expense-plan')
            }
          } catch (error) {

          }

        }
      }

    } catch (error) {
      if (error.response?.status === 422) {
        setFormError(error.response.data.errors);
        console.log(formError)
      }
    }
  }
  return (
    <div className="w-full p-8 flex justify-center items-center mt-8">
      <div className="w-full bg-white rounded-md p-7  text-center">
        <h2 className="text-4xl font-bold mb-8 ">{title}</h2>
        <div className="flex justify-center items-center">
          <form className="w-full" onSubmit={handleSubmit}>

            {/* <div className="w-full md:w-1/2 lg:w-2/5 mb-2 ">
              <div className="flex gap-2 items-center">
                <label htmlFor="title">Create from Plan:</label>
                <select
                  className="w-1/3 rounded-sm border border-[#D1D1D1] p-2"
                  name='budget_timeline_id'
                  onChange={handleChange}
                  value={form.expense_plan_id}>
                  <option value="">Select</option>
                </select>

              </div>
              <p className="text-red-500">
                {
                }
              </p>
            </div> */}
            <div className="md:flex md:gap-4 mb-6 lg:justify-between">
              <div className="w-full md:w-1/2 lg:w-2/5 mb-2 text-start">
                <div className="flex gap-2 items-center">
                  <label htmlFor="title">Title:</label>
                  <input type="text"
                    className="w-full p-2 rounded-md border border-[#d5d2d2]"
                    onChange={handleChange}
                    name='title' placeholder='name'
                    value={form.title}
                  />

                </div>
                <p className="text-red-500">
                  {
                    formError.title
                  }
                </p>
              </div>
              <div className="w-full md:w-1/2 lg:w-2/5 mb-2 text-start">
                <div className="flex gap-2 items-center">
                  <label htmlFor="budget_timeline_id" className='text-nowrap'>Budget Timeline:</label>
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
                </div>
                <p className="text-red-500">
                  {
                    formError.budget_timeline_id
                  }
                </p>
              </div>
            </div>

            {
              type == 'expensePlan' &&
              <div className="md:flex md:gap-4 mb-6 lg:justify-between">

                <div className="flex items-center gap-2 md:w-2/5 mb-2">
                  <label className="">
                    Purpose
                  </label>
                  <textarea row='2'
                    name='purpose'
                    type="text"
                    className="flex-1 rounded-sm border p-2 border-[#989898]"
                    value={form.purpose}
                    placeholder='Purpose'
                    onChange={handleChange}></textarea>
                </div>


                <div className="flex item-center gap-3 mb-2">
                  <div className="w-1/2">
                    <div className="flex gap-3 items-center">
                      <label htmlFor="start_at" className=''>Start At</label>
                      <input type="date" className="w-2/3  p-2 rounded-md border border-[#D1D1D1]" name='start_at' placeholder='Start at' value={form.start_at} onChange={handleChange} />
                    </div>
                    <p className="text-red-500">
                      {
                        formError.start_at
                      }
                    </p>
                  </div>
                  <div className="w-1/2">
                    <div className="flex gap-3 items-center">
                      <label htmlFor="end_at" className=''>End At</label>
                      <input type="date" className="w-2/3 p-2 rounded-md border border-[#D1D1D1]" name='end_at' placeholder='End at' value={form.end_at} onChange={handleChange} />
                    </div>
                    <p className="text-red-500">
                      {
                        formError.end_at
                      }
                    </p>
                  </div>
                </div>
              </div>
            }


            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm py-3 mx-auto mb-4 w-full">
              <h3 className="font-bold text-xl">Expense Items</h3>
              <div className="mt-5">


                <div className="w-full border-t border-gray-400">


                  {form.expense_items?.map((row, index) => (
                    <div className="grid lg:grid-cols-7 gap-4 w-full border-b border-gray-400 py-4 mb-3 " key={index}>

                      <div className="grid xl:grid-cols-3 lg:grid-cols-2  lg:col-span-6 gap-x-6 gap-y-4 pr-2">
                        <div className="">
                          <div className="flex items-center gap-2">
                            <label className="w-30">Name <span className="text-red-600">*</span></label>
                            <input
                              type="text"
                              className="flex-1 p-2 border rounded-sm border-[#989898]"
                              value={row.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            />
                          </div>
                          {formError[`expense_items.${index}.name`] && (
                            <span className="text-red-500">
                              {formError[`expense_items.${index}.name`][0]}
                            </span>
                          )}

                        </div>


                        <div className="flex items-center gap-2">
                          <label className="w-30">Amount <span className="text-red-600">*</span></label>
                          <input
                            type="text"
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.amount}
                            onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">
                            Description
                          </label>
                          <textarea row='2'
                            name='description'
                            type="text"
                            className="flex-1 rounded-sm border p-2 border-[#989898]"
                            // value={row.description ??''}
                            value={row.description && row.description !== 'null' ? row.description : ''}
                            placeholder='Description'
                            onChange={(e) =>
                              handleItemChange(index, 'description', e.target.value)
                            }></textarea>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">Contact</label>
                          <select
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.contact_id}
                            onChange={(e) =>
                              handleItemChange(index, 'contact_id', e.target.value)
                            }
                          >
                            <option value="">Select contact</option>
                            {contacts?.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">
                            Location <span className="text-red-600">*</span>
                          </label>
                          <select
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.location_id}
                            onChange={(e) =>
                              handleItemChange(index, 'location_id', e.target.value)
                            }
                          >
                            <option value="">Select location</option>
                            {locations.map(l => (
                              <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">Department<span className="text-red-600">*</span></label>
                          <select
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.department_id}
                            onChange={(e) =>
                              handleItemChange(index, 'department_id', e.target.value)
                            }
                          >
                            <option value="">Select department</option>
                            {departments.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">
                            Budget <span className="text-red-600">*</span>
                          </label>
                          <select
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.budget_id}
                            onChange={(e) =>
                              handleItemChange(index, 'budget_id', e.target.value)
                            }
                          >
                            <option value="">Select budget</option>
                            {budgets.map(b => (
                              <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">Expense Category<span className="text-red-600">*</span></label>
                          <select
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.expense_category_id}
                            onChange={(e) =>
                              handleItemChange(index, 'expense_category_id', e.target.value)
                            }
                          >
                            <option value="">Select category</option>
                            {expenseCategories.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="w-30">
                            Paid By <span className="text-red-600">*</span>
                          </label>
                          <select
                            className="flex-1 p-2 border rounded-sm border-[#989898]"
                            value={row.paid_by_id}
                            onChange={(e) =>
                              handleItemChange(index, 'paid_by_id', e.target.value)
                            }
                          >
                            <option value="">Company</option>
                            {employees?.map(e => (
                              <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                          </select>
                        </div>

                      </div>

                      <div className="flex items-center justify-center pt-2">
                        <button
                          type="button"
                          className="bg-red-600 text-white px-3 py-1 rounded-md"
                          onClick={() => {
                            if (row.id) {
                              deleteRow(row.id)
                            }
                            handleRemoveRow(index)
                          }}
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  ))}

                  <div className="flex justify-end w-full">
                    <button type='button' className='bg-blue-700 text-white rounded-sm w-44 p-1 hover:bg-blue-800 transition-all' onClick={addExpenseItemRow}
                    >+Add Another Item</button>
                  </div>

                </div>
              </div>
            </div>
            <div className="shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] bg-white border border-[#989898] rounded-sm py-3 px-2 mx-auto mb-4 w-full">
              <h3 className="font-bold text-xl">Transactional Attachment</h3>
              <div className="flex justify-center items-center">
                <div className="mt-3 w-3/5 rounded-sm border border-[#D1D1D1] h-36 flex justify-center items-center" onClick={handleClick}>
                  <div className="flex-col text-lg">
                    <input type="file" className='hidden' multiple ref={hiddenFileInput} onChange={handleFileChange} accept='jpg,jpeg,png,pdf' />
                    <FontAwesomeIcon icon={faImages} className='text-5xl' />
                    <div className="">Choose Images</div>

                  </div>

                </div>

              </div>
              <AttachmentList
                existingFiles={existingFiles}
                attachments={attachments}
                removeExistingFile={removeExistingFile}
                removeNewFile={removeImage}
              />

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