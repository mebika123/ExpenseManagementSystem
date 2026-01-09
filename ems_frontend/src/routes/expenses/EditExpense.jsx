import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../axios'
import ExpenseForm from '../../components/ui/form/ExpenseForm'

const EditExpense = () => {
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [idExpense, setIdExpense] = useState([null]);
  useEffect(() => {
    const fetchIdExpense = async () => {
      try {
        const res = await axiosInstance(`expense/${id}`);
        setIdExpense(res.data.expense|| null);
      } catch (error) {
        console.log(error)
        setIdExpense(null);
      }
      finally {
        setLoading(false)
      }
    }
    fetchIdExpense();

  }, [id])

  const navigate = useNavigate()
  useEffect(() => {
    if (idExpense && idExpense.isEditable === false) {
      alert("Can't edit approved item!");
      navigate('/expenses', { replace: true });
    }
  }, [idExpense, navigate]);

  if (loading) return <div>Loading...</div>;

  // Expense not found
  if (!idExpense)  {
      alert("Can't find editable item!");
      navigate('/expenses', { replace: true });
    }




  return (
    <>
      {
        !loading &&

        <ExpenseForm
          id={id}
          title={"Edit Expense"}
          data={idExpense}
          type={'expense'}

        />
      }
    </>)
}

export default EditExpense