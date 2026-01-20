import React from 'react'
import CustomRole from '../../components/ui/form/CustomRole'
import { useParams } from 'react-router-dom'

const EditRole = () => {
    const {id} = useParams();
  return (
    <div>
        <CustomRole
        title = {'Update Role'}
        id={id}
        />
    </div>

  )
}

export default EditRole