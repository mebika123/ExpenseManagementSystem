import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { can } from '../../utils/permission'
import { useAuth } from '../../context/AuthContext';

const Contacts = () => {

  const { permissions, loading } = useAuth();
  const [contacts, setContacts] = useState();
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axiosInstance.get('/contacts')
        // console.log()
        setContacts(res.data.contacts)

      } catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, [])

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;

    try {
      await axiosInstance.delete(`/contacts/${contactId}`);
      alert('Contact deleted successfully');
      // Optional: remove from state to update UI
      setContacts((prev) => prev.filter(c => c.id !== contactId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact');
    }
  };


  return (<>
    <div className="w-full p-8 flex justify-center items-center mt-8">

      <div className="w-4/5 bg-white rounded-md p-7  text-center">

        <h2 className="text-4xl font-bold  mb-8 ">Contact List </h2>
        <div className="flex justify-end ml-10">
          <a href='/user/new' className="px-4 py-2 bg-[#32b274]  rounded-lg text-white text-end" >Add New</a>

        </div>

        <div className="flex justify-center items-center w-full">
          <table className=" w-full">
            <thead>
              <tr className="mb-3 border-b">
                <th className="py-3">S.N</th>
                <th className="py-3">Code</th>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Contact</th>
                <th className="py-3">Type</th>
                <th className="py-3">Type Code</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>

              {loading ? (
                <tr>
                  <td colSpan='4' className="text-xl font-semibold mt-5 w-full">Loading...</td>
                </tr>
              ) : (

                contacts?.map((contact, index) => (
                  <tr className="mb-3 border-b even:bg-[#dce0e1] odd:bg-white">
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3">{contact?.code || '-'}</td>
                    <td className="py-3">{contact?.name || '-'}</td>
                    <td className="py-3">{contact.email}</td>
                    <td className="py-3">{contact?.phone_no || '-'}</td>
                    <td className="py-3">{contact?.contact_type || '-'}</td>
                    <td className="py-3">{contact?.employee?.code || '-'}</td>
                    <td className="py-3">
                      <div className="flex gap-4 items-center justify-center">

                        <div className="flex gap-4 items-center justify-center">
                          {
                            can('contact.update', permissions) &&
                            <Link to={`/contact/edit/${contact.id}`}>
                              <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#32B274]">
                                <FontAwesomeIcon icon={faPen} />
                              </div>
                            </Link>
                          }
                          {
                            can('contact.delete', permissions) &&

                            <div className="h-9 w-9 justify-center flex items-center text-white rounded-sm bg-[#FF3641]">
                              <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(contact.id)} />

                            </div>
                          }
                        </div>


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
  </>)
}

export default Contacts