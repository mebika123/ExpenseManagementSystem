import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ExpenseForm from '../../components/ui/form/ExpenseForm';
import axiosInstance from '../../axios';

const EditExpensePlan = () => {

    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const [idExpense, setIdExpense] = useState([]);
    useEffect(() => {
        const fetchIdExpense = async () => {
            try {
                const res = await axiosInstance(`expensePlan/${id}`);
                setIdExpense(res.data.expense);
                console.log('test')
                console.log(res.data.expense);
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
                title={"Edit Expense Plan"}
                data={idExpense}
                type={'expensePlan'}

            />
        }
        </>)
}

export default EditExpensePlan