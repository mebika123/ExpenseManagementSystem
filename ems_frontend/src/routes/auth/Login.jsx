import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';

const Login = () => {
  const { user, login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState({
    email: [],
    password: [],
  })
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login", form);
      if (res.data) {
        const { user, token } = res.data;
        login(user, token);
        navigate("/dashboard")
      }
    } catch (err) {
      const errors = err.response?.data?.errors || {};
      setFormError({
        email: errors.email || [],
        password: errors.password || []
      });
      setError(err.response?.data?.message || 'Something went wrong');
    }


  }

  return (<>
    <div className="flex justify-center items-center h-screen w-full">
      <div className="text-center p-4 rounded-lg w-1/3 bg-white shadow-lg shadow-indigo-500/50">
        <h2 className="text-4xl font-bold uppercase mb-8 ">Welcome </h2>
        {/* <h6 className="">EMS</h6> */}
        <div className="flex justify-center items-center">
          <form onSubmit={handleSubmit} className="w-5/6">
            <div className="mb-6 w-full">
              <input type="text" name='email' className="w-full p-2 rounded-md border border-[#D1D1D1]" value={form.email} onChange={handleChange} placeholder='Email' />
              <p className="text-red-500">
                {
                  formError.email[0]
                }
              </p>
            </div>
            <div className="mb-6 w-full">
              <input type="password" name='password' className="w-full p-2 rounded-md border border-[#D1D1D1]" value={form.password} onChange={handleChange} placeholder='Passsword' />
              <p className="text-red-500">
                {
                  formError.password[0]
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

  </>)
}

export default Login