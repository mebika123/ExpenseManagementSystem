import React from 'react'
import ContactForm from '../../components/ui/form/ContactForm'
import { useParams } from 'react-router-dom'

const EditContact = () => {
    const {id} =useParams();
  return (
<>
        <ContactForm
        title={'Edit Contact'}
        id={id}/>
        
        </>  )
}

export default EditContact