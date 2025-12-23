import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axiosInstance from '../axios';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUser = async () => {
            
            try {
                // const res = await axiosInstance.get('/user',{
                //     headers: {
                //     Authorization: `Bearer ${Cookies.get('auth_token')}`
                // }
                // });
                 const res = await axiosInstance.get('/authuser');
                setUser(res.data);

            } catch (error) {
                setUser(null);

            }
            finally {
                setLoading(false);

            }
        }
        fetchUser();

    }, [])

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('auth_token',token);
     };


    const logout = async () => {
        try {
            // await axiosInstance.post('/logout', {}, {
            //     headers: {
            //         Authorization: `Bearer ${Cookies.get('auth_token')}`
            //     }

            // })
            await axiosInstance.post('/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)