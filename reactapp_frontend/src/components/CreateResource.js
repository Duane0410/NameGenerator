import React, { useEffect } from 'react'
import NameGenerate from './NameGenerate'
import { useLocation } from 'react-router-dom'

const CreateResource = () => {

    const location = useLocation()
    const objectID = location.state
    console.log('ObjectID - ', objectID)

    useEffect(() => {
        console.log('LocationState - ', location.state)
    }, [])

  return (
    <div className='w-100 vh-50 '>
        <NameGenerate resourceID={objectID} operationType={'create'} />
    </div>
  )
}

export default CreateResource