import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../axios';

const UserForm = ({ userId = null, isEdit = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    // Check if current user is admin or superadmin
    const isAdminOrSuperAdmin = user?.roles?.some(role =>
        ['admin', 'superadmin'].includes(role)
    );

    const [createContact, setCreateContact] = useState(true);

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
        contact_type: '',
        create_contact: true
    });

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
    });

    // Fetch departments
    const [departments, setDepartment] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await axiosInstance.get('/departments');
                setDepartment(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDepartments();
    }, []);

    // Fetch locations
    const [locations, setLocation] = useState([]);
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axiosInstance.get('/locations');
                setLocation(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLocations();
    }, []);

    // Fetch user roles
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const res = await axiosInstance.get('/roles');
                setRoles(res.data.roles);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserRole();
    }, []);

    // Fetch user data if editing
    useEffect(() => {
        if (isEdit && userId) {
            const fetchUserData = async () => {
                setFetchingData(true);
                try {
                    const res = await axiosInstance.get(`/users/${userId}`);
                    const userData = res.data.user;
                    const userRole = userData.roles?.[0]?.name || '';

                    setForm({
                        name: userData.name || '',
                        email: userData.email || '',
                        phone_no: userData.contact?.phone_no || '',
                        pan_no: userData.contact?.pan_no || '',
                        department_id: userData.contact?.department_id || '',
                        location_id: userData.contact?.location_id || '',
                        password: '',
                        password_confirmation: '',
                        role: userRole,
                        contact_type: userData.contact?.contact_type || '',
                        create_contact: !!userData.contact_id
                    });

                    setCreateContact(!!userData.contact_id);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    alert('Failed to load user data');
                } finally {
                    setFetchingData(false);
                }
            };
            fetchUserData();
        }
    }, [isEdit, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear error for this field when user starts typing
        setFormError({ ...formError, [name]: [] });
    };

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setCreateContact(checked);
        setForm({ ...form, create_contact: checked });

        // Clear contact-specific fields if not creating contact
        if (!checked) {
            setForm(prev => ({
                ...prev,
                phone_no: '',
                pan_no: '',
                department_id: '',
                location_id: '',
                contact_type: ''
            }));

            // Clear contact field errors
            setFormError(prev => ({
                ...prev,
                phone_no: [],
                pan_no: [],
                department_id: [],
                location_id: [],
                contact_type: []
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (isEdit) {
                res = await axiosInstance.put(`/users/${userId}`, form);
                alert('User updated successfully!');
            } else {
                res = await axiosInstance.post("/users", form);
                alert('User created successfully!');
            }

            // Reset form if creating new user
            if (!isEdit) {
                setForm({
                    name: '',
                    email: '',
                    phone_no: '',
                    pan_no: '',
                    department_id: '',
                    location_id: '',
                    password: '',
                    password_confirmation: '',
                    role: '',
                    contact_type: '',
                    create_contact: true
                });
                setCreateContact(true);
            }

            // Navigate to users list or stay on page
            navigate('/users');

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

            alert(err.response?.data?.message || 'Validation failed. Please check the form.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="w-full p-8 flex justify-center items-center mt-8">
                <div className="text-lg">Loading user data...</div>
            </div>
        );
    }

    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-2/3 bg-white rounded-md p-7 text-center shadow-md">
                <h2 className="text-4xl font-bold mb-8">
                    {isEdit ? 'Edit User' : 'New User'}
                </h2>
                <div className="flex justify-center items-center">
                    <form onSubmit={handleSubmit} className="w-3/4">

                        {/* Only show checkbox for admin/superadmin */}
                        {isAdminOrSuperAdmin && (
                            <div className="mb-6 w-full flex items-center justify-center gap-2 bg-blue-50 p-3 rounded-md">
                                <input
                                    type="checkbox"
                                    id="createContact"
                                    checked={createContact}
                                    onChange={handleCheckboxChange}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="createContact" className="font-medium">
                                    Create Contact Information (uncheck to create user only)
                                </label>
                            </div>
                        )}
                        {/* Contact Fields - Only show if createContact is true */}
                        {createContact && (
                            <>
                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                        name='name'
                                        placeholder='Name *'
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formError.name[0] && (
                                        <p className="text-red-500 text-left text-sm mt-1">{formError.name[0]}</p>
                                    )}
                                </div>


                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                        name='phone_no'
                                        placeholder='Phone Number *'
                                        value={form.phone_no}
                                        onChange={handleChange}
                                        required={createContact}
                                    />
                                    {formError.phone_no[0] && (
                                        <p className="text-red-500 text-left text-sm mt-1">{formError.phone_no[0]}</p>
                                    )}
                                </div>

                                <div className="mb-6 w-full">
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                        name='pan_no'
                                        placeholder='PAN Number'
                                        value={form.pan_no}
                                        onChange={handleChange}
                                    />
                                    {formError.pan_no[0] && (
                                        <p className="text-red-500 text-left text-sm mt-1">{formError.pan_no[0]}</p>
                                    )}
                                </div>

                                <div className="mb-6 w-full">
                                    <select
                                        name="contact_type"
                                        className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                        value={form.contact_type}
                                        onChange={handleChange}
                                        required={createContact}
                                    >
                                        <option value="">Select Contact Type *</option>
                                        <option value="employee">Employee</option>
                                        <option value="supplier">Supplier</option>
                                    </select>
                                    {formError.contact_type[0] && (
                                        <p className="text-red-500 text-left text-sm mt-1">{formError.contact_type[0]}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <div className="mb-6 w-full">
                                        <select
                                            name="department_id"
                                            className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                            value={form.department_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((department) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formError.department_id[0] && (
                                            <p className="text-red-500 text-left text-sm mt-1">{formError.department_id[0]}</p>
                                        )}
                                    </div>

                                    <div className="mb-6 w-full">
                                        <select
                                            name="location_id"
                                            className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                            value={form.location_id}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Location</option>
                                            {locations.map((location) => (
                                                <option key={location.id} value={location.id}>
                                                    {location.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formError.location_id[0] && (
                                            <p className="text-red-500 text-left text-sm mt-1">{formError.location_id[0]}</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Basic User Fields - Always Required */}


                        <div className="mb-6 w-full">
                            <input
                                type="email"
                                className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                name='email'
                                placeholder='Email *'
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            {formError.email[0] && (
                                <p className="text-red-500 text-left text-sm mt-1">{formError.email[0]}</p>
                            )}
                        </div>

                        <div className="mb-6 w-full">
                            <input
                                type="password"
                                className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                placeholder={isEdit ? 'Password (leave blank to keep current)' : 'Password *'}
                                name='password'
                                value={form.password}
                                onChange={handleChange}
                                required={!isEdit}
                            />
                            {formError.password[0] && (
                                <p className="text-red-500 text-left text-sm mt-1">{formError.password[0]}</p>
                            )}
                        </div>

                        <div className="mb-6 w-full">
                            <input
                                type="password"
                                className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                placeholder={isEdit ? 'Confirm Password' : 'Confirm Password *'}
                                name='password_confirmation'
                                value={form.password_confirmation}
                                onChange={handleChange}
                                required={!isEdit && form.password !== ''}
                            />
                            {formError.password_confirmation[0] && (
                                <p className="text-red-500 text-left text-sm mt-1">{formError.password_confirmation[0]}</p>
                            )}
                        </div>

                        <div className="mb-6 w-full">
                            <select
                                name="role"
                                className="w-full p-2 rounded-md border border-[#D1D1D1]"
                                value={form.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select User Role *</option>
                                {roles.map((role) => (
                                    <option key={role.name} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {formError.role[0] && (
                                <p className="text-red-500 text-left text-sm mt-1">{formError.role[0]}</p>
                            )}
                        </div>



                        <div className="mb-6 w-full mt-6 flex gap-3 justify-center">

                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#3F3FF2] rounded-lg text-white cursor-pointer hover:bg-[#2F2FE2] transition disabled:bg-gray-400"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (isEdit ? 'Update' : 'Create')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;