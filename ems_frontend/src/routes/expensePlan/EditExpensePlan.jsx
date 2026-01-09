import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../../components/ui/form/ExpenseForm';
import axiosInstance from '../../axios';

const EditExpensePlan = () => {

    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const [idExpense, setIdExpense] = useState([null]);
    useEffect(() => {
        const fetchIdExpense = async () => {
            try {
                const res = await axiosInstance(`expensePlan/${id}`);
                setIdExpense(res.data.expense || null);
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
            navigate('/expense-plan', { replace: true });
        }
    }, [idExpense, navigate]);

    if (loading) return <div>Loading...</div>;

    if (!idExpense) {
        alert("Can't find editable item!");
        navigate('/expense-plan', { replace: true });
    }
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