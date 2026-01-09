import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios'
import { useNavigate, useParams } from 'react-router-dom'
import AdvanceForm from '../../components/ui/form/AdvanceForm'

const EditAdvance = () => {
  const { id } = useParams()
  const [advance, setAdvance] = useState([null])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchadvance = async () => {
      try {
        const res = await axiosInstance.get(`/advances/${id}`)
        setAdvance(res.data.advance || null)
        
      } catch (error) {
        console.error(error)
        setAdvance(null)
      }
      finally {
      setLoading(false) // stop showing loading
    }

    }
    fetchadvance()
  }, [])

  console.log(advance)
  const navigate = useNavigate()
  useEffect(() => {
    if (advance && advance.isEditable === false) {
      alert("Can't edit approved item!");
      navigate('/advances', { replace: true });
    }
  }, [advance, navigate]);

  if (loading) return <div>Loading...</div>;

  if (!advance) {
    alert("Can't find editable item!");
    navigate('/advances', { replace: true });
  }

  return (<>
    <AdvanceForm
      title={'Edit Advance'}
      id={id}
      data={advance}
    />
  </>
  )
}

export default EditAdvance