import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = () => {
  const { user, logout } = useAuth();
  return (<>
    <div className="w-6/7 shadow-sm p-4 fixed top-0 w- bg-white py-4 px-3">

      <div className="text-end mr-4 flex items-center justify-end">
        <div className="p-3 flex items-center gap-3">
          <div>
            <FontAwesomeIcon icon={faUser} size="lg" />
          </div>
          <span className="wrap-break-words text-gray-900">
            {user?.code ? user?.code : user?.email}
          </span>
        </div>
        <div
          onClick={logout}
          className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
             bg-blue-50 text-[#3F3FF2] hover:bg-blue-100
             transition-all duration-200"
          title="Logout"
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-2xl"
          />
        </div>

        {/* <a onClick={() => { logout() }} className="px-4 py-2 text-lg font-semibold  bg-[#3F3FF2]  rounded-lg text-white w-36 text-center">Logout</a> */}
      </div>
    </div>
  </>
  )
}

export default Header