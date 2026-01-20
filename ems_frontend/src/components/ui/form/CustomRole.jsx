import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../axios';

const CustomRole = ({ title, id }) => {

    const [loading, setLoading] = useState(true)
    const [permissions, setPermissions] = useState([]);

    const [form, setForm] = useState({
        name: '',
        permissions: []
    })
    useEffect(() => {
        if (!id) return;

        const fetchFormData = async () => {
            try {
                const res = await axiosInstance.get(`/roles/${id}`);

                setForm({
                    name: res.data.role.name,
                    permissions: res.data.permissions.map(p => p.id)
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchFormData();
    }, [id]);


    // const handleChecked = (e) => {
    //     const permissionId = e.target.value;

    //     setForm(prevForm => {
    //         const newPermissions = prevForm.permission.includes(permissionId)
    //             ? prevForm.permission.filter(id => id !== permissionId)
    //             : [...prevForm.permission, permissionId];
    //         return {
    //             ...prevForm,
    //             permission: newPermissions
    //         };
    //     });

    // };
    const handleChecked = (e) => {
        const permissionId = Number(e.target.value);

        setForm(prev => ({
            ...prev,
            permissions: e.target.checked
                ? [...prev.permissions, permissionId]
                : prev.permissions.filter(id => id !== permissionId)
        }));
    };


    // console.log(seletedPermission)
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const res = await axiosInstance.get('/permissions');
                setPermissions(res.data.permissions);

            } catch (error) {
                console.log(error)

            }
        }
        fetchPermission();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await axiosInstance.put(`/roles/${id}`, form);
            } else {
                await axiosInstance.post('/roles', form);
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (
        // <></>
        <div className="w-full p-8 flex justify-center items-center mt-8">
            <div className="w-full bg-white rounded-md p-7 lg:w-3/5 text-center">
                <h2 className="text-4xl font-bold mb-8 ">{title}</h2>
                <div className="flex justify-center items-center w-full">
                    <form className="w-full lg:w-4/5" onSubmit={handleSubmit}>
                        <div className="">
                            <div className="w-full mb-2 text-start">
                                <div className=" mb-4 flex flex-col">
                                    <label htmlFor="name" className='font-semibold' >Role Name:</label>
                                    <input type="text"
                                        className="w-full lg:w-3/5 p-2 rounded-md border mt-4 border-[#d5d2d2]"
                                        onChange={handleChange}
                                        name='name' placeholder='name'
                                        value={form.name}
                                    />

                                </div>
                                <p className="text-red-500">
                                    {/* s */}
                                </p>
                            </div>
                            <div className="w-full mb-2 text-start">
                                <div className="">
                                    <label htmlFor="budget_timeline_id" className='font-semibold' >Assign Permission:</label>
                                    <div className="grid grid-cols-2 mt-3">
                                        {
                                            permissions?.map((permission, index) => (
                                                <div className="flex gap-2 mb-2" key={index}>
                                                    <input type="checkbox" value={permission.id}
                                                        checked={form.permissions.includes(permission.id)}
                                                        onChange={handleChecked} />
                                                    <span>{permission.name}</span>

                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <p className="text-red-500">

                                </p>
                            </div>
                        </div>



                        <div className="mb-6 w-full">
                            <button type="submit" className="px-4 py-2 bg-[#3F3FF2]  rounded-lg text-white w-1/3" >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CustomRole