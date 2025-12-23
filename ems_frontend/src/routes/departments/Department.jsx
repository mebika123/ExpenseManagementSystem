import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';


const Department = () => {
    // modal
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    //create new department
    const [form, setForm] = useState({ name: '' });

    const [error, setError] = useState(null)
    const [formError, setFormError] = useState({ name: [] })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/departments", form);
            if (res.data) {
                alert("Department Created Successfully!");
                setIsOpen(false)

            }
        } catch (err) {
            const errors = err.response?.data?.errors || {};
            setFormError({
                name: errors.name || []
            });
            setError(err.response?.data?.message || 'Something went wrong');
        }
    }

    // fetch department
    const [loading, setLoading] = useState(true);
    const [departments, setDepartment] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get('/departments');
                setDepartment(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchDepartments();
    }, []);

    //detele department
    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this department?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/departments/${id}`);
            setDepartment(departments?.filter(department => department?.id !== id));
            alert('Department deleted successfully!');
        } catch (error) {
            console.error('Failed to delete department:', error);
            alert('Failed to delete department. Please try again.');
        }
    }




    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            {isOpen && (
                <div className="h-screen w-screen fixed bg-[#000000b8] top-0 left-0 flex justify-center items-center">
                    <div className="bg-white p-5 w-1/3 rounded-md ">
                        <div className="text-end"><FontAwesomeIcon icon={faXmark} onClick={closeModal} /></div>
                        <h2 className="text-2xl font-bold uppercase mb-8 ">New Department </h2>
                        <div className="flex justify-center items-center">
                            <form className="w-3/4" onSubmit={handleSubmit}>
                                <div className="mb-6 w-full">
                                    <input type="text" className="w-full p-2 rounded-md border border-[#989898]" name='name' value={form.name} onChange={handleChange} placeholder='Department Name' />
                                    <p className="text-red-500">
                                        {
                                            formError.name[0]
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

                <h2 className="text-4xl font-bold uppercase mb-8 ">Department List </h2>
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

                                departments.map((department, index) => (
                                    <tr className="mb-3" key={department.id}>
                                        <td className="py-3">{index + 1}</td>
                                        <td className="py-3">{department.name}</td>
                                        <td className="py-3">{department.code}</td>
                                        <td className="py-3">
                                            <div className="flex gap-4 items-center justify-center">
                                                <a className='px-4 py-2 bg-[#5619fe]  rounded-lg text-white'>Edit</a>
                                                <button onClick={() => handleDelete(department.id)}
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

export default Department