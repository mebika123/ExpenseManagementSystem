import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';


const ExpenseCategory = () => {
    // modal
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    //create new expense category
    const [form, setForm] = useState({ title: '' });

    const [error, setError] = useState(null)
    const [formError, setFormError] = useState({ title: [] })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/expenseCategories", form);
            if (res.data) {
                alert("Expense Category Created Successfully!");
                setIsOpen(false)

            }
        } catch (err) {
            const errors = err.response?.data?.errors || {};
            setFormError({
                title: errors.title || []
            });
            setError(err.response?.data?.message || 'Something went wrong');
        }
    }

    // fetch category
    const [loading, setLoading] = useState(true);
    const [expenseCategories, setExpenseCategories] = useState([]);
    useEffect(() => {
        const fetchExpenseCategories = async () => {
            try {
                const res = await axiosInstance.get('/expenseCategories');
                setExpenseCategories(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchExpenseCategories();
    }, []);

    //detele category
    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this Expense Category?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/departments/${id}`);
            setExpenseCategories(expenseCategories?.filter(expenseCategory => expenseCategory?.id !== id));
            alert('Expense Category deleted successfully!');
        } catch (error) {
            console.error('Failed to delete Expense Category:', error);
            alert('Failed to delete Expense Category. Please try again.');
        }
    }




    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            {isOpen && (
                <div className="h-screen w-screen fixed bg-[#000000b8] top-0 left-0 flex justify-center items-center">
                    <div className="bg-white p-5 w-1/3 rounded-md text-center">
                        <div className="text-end"><FontAwesomeIcon icon={faXmark} onClick={closeModal} /></div>
                        <h2 className="text-2xl font-bold uppercase mb-8 ">New Expense Category </h2>
                        <div className="flex justify-center items-center">
                            <form className="w-3/4" onSubmit={handleSubmit}>
                                <div className="mb-6 w-full">
                                    <input type="text" className="w-full p-2 rounded-md border border-[#989898]" name='title' value={form.title} onChange={handleChange} placeholder='Category Name' />
                                    <p className="text-red-500">
                                        {
                                            formError.title[0]
                                        }
                                    </p>
                                </div>
                                <div className="mb-6 w-full">
                                    <input type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" />
                                </div>
                            </form>
                        </div>

                    </div>

                </div>

            )}

            <div className="w-4/5 bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold uppercase mb-8 ">Expense Categories List </h2>
                <div className="flex justify-end ml-10">
                    <a className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end" onClick={openModal}>Add New</a>

                </div>

                <div className="flex justify-center items-center w-full">
                    <table className=" w-full">
                        <thead>
                            <tr className="mb-3 border-b">
                                <th className="py-3">S.N</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Code</th>
                                <th className="py-3 w-1/5">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {loading ? (
                                <tr>
                                    <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                                </tr>
                            ) : (

                                expenseCategories.map((expenseCategory, index) => (
                                    <tr className="mb-3" key={expenseCategory.id}>
                                        <td className="py-3">{index + 1}</td>
                                        <td className="py-3">{expenseCategory.title}</td>
                                        <td className="py-3">{expenseCategory.code}</td>
                                        <td className="py-3">
                                            <div className="flex gap-4 items-center justify-center">
                                                <a className='px-4 py-2 bg-[#5619fe]  rounded-lg text-white'>Edit</a>
                                                <button onClick={() => handleDelete(expenseCategory.id)}
                                                    className='px-4 py-2 bg-[#fe1919]  rounded-lg text-white'>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))


                            )}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}

export default ExpenseCategory