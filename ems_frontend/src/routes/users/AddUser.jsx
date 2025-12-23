import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';

const AddUser = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone_no: '',
        pan_no: '',
        department_id: '',
        location_id: '',
        password: '',
        password_confirmation: '',
        role: '',
        contact_type: ''
    });

    const [error, setError] = useState(null)
    const [formError, setFormError] = useState({
        name: [],
        email: [],
        phone_no: [],
        pan_no: [],
        department_id: [],
        location_id: [],
        password: [],
        password_confirmation: [],
        role: [],
        contact_type: []
    })

    // fetch department
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

    // fetch location
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

    // fetch user role
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await axiosInstance.get('/roles');
                setRoles(res.data.roles);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserRole()
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post("/users", form);
            // if (res.data) {

            // }
        } catch (err) {
            const errors = err.response?.data?.errors || {};
            setFormError({
                name: errors.name || [],
                email: errors.email || [],
                phone_no: errors.phone_no || [],
                pan_no: errors.pan_no || [],
                department_id: errors.department_id || [],
                location_id: errors.location_id || [],
                password: errors.password || [],
                password_confirmation: errors.password_confirmation || [],
                role: errors.role || [],
                contact_type: errors.contact_type || []
            });
            console.log(formError);
            setError(err.response?.data?.message || 'Something went wrong');
        }


    }
    return (<>
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-2/3 bg-white rounded-md p-7  text-center">
                <h2 className="text-4xl font-bold uppercase mb-8 ">New User </h2>
                <div className="flex justify-center items-center">
                    <form onSubmit={handleSubmit} className="w-3/4">
                        <div className="mb-6 w-full">
                            <input type="text" className="w-full p-2 rounded-md border border-[#D1D1D1]" name='name' placeholder='name' value={form.name} onChange={handleChange} />
                            <p className="text-red-500">
                                {
                                    formError.name[0]
                                }
                            </p>
                        </div>
                        <div className="mb-6 w-full">
                            <input type="text" className="w-full p-2 rounded-md border border-[#D1D1D1]" name='email' placeholder='Email' value={form.email} onChange={handleChange} />
                            <p className="text-red-500">
                                {
                                    formError.email[0]
                                }
                            </p>
                        </div>
                        <div className="mb-6 w-full">
                            <input type="text" className="w-full p-2 rounded-md border border-[#D1D1D1]" name='phone_no' placeholder='Contact' value={form.phone_no} onChange={handleChange} />
                            <p className="text-red-500">
                                {
                                    formError.phone_no[0]
                                }
                            </p>
                        </div>
                        <div className="mb-6 w-full">
                            <input type="text" className="w-full p-2 rounded-md border border-[#D1D1D1]" name='pan_no' placeholder='PAN' value={form.pan_no} onChange={handleChange} />
                            <p className="text-red-500">
                                {
                                    formError.pan_no[0]
                                }
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="mb-6 w-full">
                                <select name="department_id" className="w-full p-2 rounded-md border border-[#D1D1D1]" value={form.department_id} onChange={handleChange} >
                                    <option value="">Select department</option>
                                    {
                                        departments.map((department, index) => (
                                            <option value={department.id}>{department.name}</option>

                                        ))
                                    }
                                </select>
                                <p className="text-red-500">
                                    {
                                        formError.department_id[0]
                                    }
                                </p>
                            </div>

                            <div className="mb-6 w-full">
                                <select name="location_id" className="w-full p-2 rounded-md border border-[#D1D1D1]" value={form.location_id} onChange={handleChange}>
                                    <option value="">Select location</option>
                                    {
                                        locations.map((location, index) => (
                                            <option value={location.id}>{location.name}</option>

                                        ))
                                    }
                                </select>
                                <p className="text-red-500">
                                    {
                                        formError.location_id[0]
                                    }
                                </p>
                            </div>

                        </div>
                        <div className="mb-6 w-full">
                            <input type="password" className="w-full p-2 rounded-md border border-[#D1D1D1]" placeholder='Passsword' name='password' value={form.password} onChange={handleChange} />
                            <p className="text-red-500">
                                {
                                    formError.password[0]
                                }
                            </p>
                        </div>
                        <div className="mb-6 w-full">
                            <input type="password" className="w-full p-2 rounded-md border border-[#D1D1D1]" placeholder='Confirmation Passsword' name='password_confirmation' value={form.password_confirmation} onChange={handleChange} />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex gap-3 w-1/2 items-center mb-6 ">
                                <label htmlFor="">Contact Type:</label>
                                <select name="contact_type" className=" p-2 rounded-md border border-[#D1D1D1]" value={form.contact_type} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="employee">Employee</option>
                                    <option value="supplier">Supplier</option>
                                </select>
                                <p className="text-red-500">
                                    {/* {
                                        formError.location_id[0]
                                    } */}
                                </p>
                            </div>
                            <div className="flex gap-3 w-1/2 items-center mb-6 ">
                                <label htmlFor="">User Role:</label>
                                <select name="role" className=" p-2 rounded-md border border-[#D1D1D1]" value={form.role} onChange={handleChange}>

                                    <option value="">Select</option>
                                    {
                                        roles.map((role, index) => (
                                            <option value={role.name}>{role.name}</option>

                                        ))
                                    }
                                </select>
                                <p className="text-red-500">
                                    {/* {
                                        formError.
                                    } */}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 w-full">
                            <input type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" />
                        </div>
                    </form>
                </div>
            </div >
        </div >
    </>
    )
}

export default AddUser