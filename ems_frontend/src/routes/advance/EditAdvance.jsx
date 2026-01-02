import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios'
import { useParams } from 'react-router-dom'
import AdvanceForm from '../../components/ui/form/AdvanceForm'

const EditAdvance = () => {
  const {id} = useParams()
  const [advance,setAdvance]=useState([])
  useEffect(()=>{
    const fetchadvance = async()=>{
      try {
        const res = await axiosInstance.get(`/advances/${id}`)
        setAdvance(res.data.advance)
        
      } catch (error) {
        console.error(error)
      }

    }
    fetchadvance()
  },[])
  return (<>
  <AdvanceForm
  title={'Edit Expense'}
    id={id}
    data={advance}
/>
  </>
  )
}

export default EditAdvance