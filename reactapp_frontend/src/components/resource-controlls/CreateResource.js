import React, { useEffect } from 'react'
import NameGenerate from './NameGenerate'
import { useLocation } from 'react-router-dom'

const CreateResource = () => {

    const location = useLocation()
    const objectID = location.state
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    console.log('ObjectID - ', objectID)

    useEffect(() => {
        console.log('LocationState - ', location.state)
    }, [])

  return (
    <div className='w-100 vh-50 '>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='w-50 bg-primary bg-white rounded p-3'>
          <h3 className="text-center">Create New {resource}</h3>
        </div>
      </div>
        <NameGenerate resourceID={objectID} operationType={'create'} />
    </div>
  )
}

export default CreateResource