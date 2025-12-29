import React from 'react'
import ExpenseForm from '../../components/ui/form/ExpenseForm'

const AddExpensePlan = () => {
  return (
    <>
      <ExpenseForm
        id={null}
        title={"New Expense Plan"}
        data={null}
        type = {'expensePlan'}
      />
    </>)
}

export default AddExpensePlan