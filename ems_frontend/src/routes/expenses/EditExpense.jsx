import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../axios'
import ExpenseForm from '../../components/ui/form/ExpenseForm'

const EditExpense = () => {
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [idExpense, setIdExpense] = useState([]);
  useEffect(() => {
    const fetchIdExpense = async () => {
      try {
        const res = await axiosInstance(`expense/${id}`);
        setIdExpense(res.data.expense);
      } catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false)
      }
    }
    fetchIdExpense();

  }, [id])

  return (
    <>{
      !loading &&

      <ExpenseForm
        id={id}
        title={"Edit Expense"}
        data={idExpense}
      />
    }
    </>)
}

export default EditExpense