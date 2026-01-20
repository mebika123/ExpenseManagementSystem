import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

import React from 'react'

const DashboardCard = ({title,amount}) => {
    return (
        <div className="text-start p-4 rounded-xl shadow-sm shadow-indigo-500/50  ">
            <div className="">
                <div className="flex gap-8 items-center mb-2  justify-between flex-wrap">
                    <div className="">
                        <h4 className="font-semibold">{title}</h4>
                        <div className="text-3xl font-bold"> ${amount}</div>
                    </div>
                    <FontAwesomeIcon icon={faCoins}  className='text-3xl'/>

                </div>
            </div>

        </div>
    )
}

export default DashboardCard