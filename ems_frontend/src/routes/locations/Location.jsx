import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import ModalForm from '../../components/ui/form/ModalForm';


const Location = () => {


    // fetch location
    const [loading, setLoading] = useState(true);
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
    // modal
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const [editingId, setEditingId] = useState(null);


    //create new location
    const [form, setForm] = useState({ name: '' });

    const [error, setError] = useState(null)
    const [formError, setFormError] = useState({ name: [] })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const openAdd = () => {
        setForm({ name: "" });
        setEditingId(null);
        setError({});
        setIsOpen(true);
    };
    const openEdit = (location) => {
        setForm({ name: location.name });
        setEditingId(location.id);
        setError({});
        setIsOpen(true);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                const res = await axiosInstance.put(`/locations/${editingId}`, form);
                if (res) {
                    alert("Location edited successfully!")
                    setLocation(prev =>
                        prev.map(loc =>
                            loc.id === editingId
                                ? { ...loc, ...form }
                                : loc
                        )
                    );

                    console.log(res.data);

                }
            } else {
                const res = await axiosInstance.post("/locations", form);
                if (res) {
                    alert("New Location add successfully!")
                    setLocation(prev => [...prev, res.data]);

                }

            }
            setIsOpen(false);



        } catch (err) {
            setError(err.response?.data?.errors || {});
        }
    };




    //detele location
    const handleDelete = async (id) => {

        if (!window.confirm('Are you sure you want to delete this location?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/locations/${id}`);
            setLocation(locations?.filter(location => location?.id !== id));
            alert('Location deleted successfully!');
        } catch (error) {
            console.error('Failed to delete location:', error);
            alert('Failed to delete location. Please try again.');
        }
    }



    return (
        <div className="w-full p-8 flex justify-center items-center mt-8">
            {/* {isOpen && (
                <div className="h-screen w-screen fixed bg-[#000000b8] top-0 left-0 flex justify-center items-center">
                    <div className="bg-white p-5 w-1/3 rounded-md ">
                        <div className="text-end"><FontAwesomeIcon icon={faXmark} onClick={closeModal} /></div>
                        <h2 className="text-2xl font-bold uppercase mb-8 ">New Location </h2>
                        <div className="flex justify-center items-center">
                            <form className="w-3/4" onSubmit={handleSubmit}>
                                <div className="mb-6 w-full">
                                    <input type="text" className="w-full p-2 rounded-md border border-[#989898]" name='name' value={form.name} onChange={handleChange} placeholder='location Name' />
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

            )} */}

            <Modal isOpen={isOpen}
                title={editingId ? "Edit Location" : "New Location"}
                onClose={() => setIsOpen(false)}>
                <ModalForm
                    form={form}
                    errors={error}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitText={editingId ? "Update" : "Save"}
                />
            </Modal>

            <div className="w-4/5 bg-white rounded-md p-7  text-center">

                <h2 className="text-4xl font-bold uppercase mb-8 ">Location List </h2>
                <div className="flex justify-end ml-10">
                    <button type='button' className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end" onClick={openAdd}>Add New</button>

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

                                locations.map((location, index) => (
                                    <tr className="mb-3" key={location.id}>
                                        <td className="py-3">{index + 1}</td>
                                        <td className="py-3">{location.name}</td>
                                        <td className="py-3">{location.code}</td>
                                        <td className="py-3">
                                            <div className="flex gap-4 items-center justify-center">
                                                <button onClick={() => openEdit(location)} className='px-4 py-2 bg-[#5619fe]  rounded-lg text-white'>Edit</button>
                                                <button onClick={() => handleDelete(location.id)} className='px-4 py-2 bg-[#fe1919]  rounded-lg text-white'>Delete</button>
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

export default Location