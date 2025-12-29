import React, { useEffect, useState } from 'react'
import ExpenseForm from '../../components/ui/form/ExpenseForm'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../axios';

const AddExpense = () => {

  return (
    <>
      <ExpenseForm
        id={null}
        title={"New Expense"}
        data={null}
        type={'expense'}

      />
    </>
  )
}

export default AddExpense