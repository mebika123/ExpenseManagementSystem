import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const{user,logout} = useAuth();
  return (<>
<div className="w-6/7 shadow-sm p-4 fixed top-0 w- bg-white py-4 px-3">
  <div className="text-end mr-4">
    <a onClick={()=>{logout()}} className="px-4 py-2 text-lg font-semibold  bg-[#3F3FF2]  rounded-lg text-white w-36 text-center">Logout</a>
  </div>
  </div> 
  </>
  )
}

export default Header