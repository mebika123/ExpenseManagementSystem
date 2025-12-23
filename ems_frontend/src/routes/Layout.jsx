import React, { useEffect } from 'react'
import Header from '../components/layouts/header'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layouts/Sidebar'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login')
        }
    }, [user, loading, navigate])
    // console.log(user)
    if (loading) return <div>Loading...</div>;
    return (
        <div className='flex '>
            <Sidebar />
            <div className="md:w-6/7 w-full md:ms-auto ">
                <Header />
                <div className='pt-8 pb-3 px-7'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout