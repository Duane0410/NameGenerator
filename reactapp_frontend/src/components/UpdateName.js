import React, { useEffect } from 'react'
import NameGenerate from './NameGenerate'
import { useLocation } from 'react-router-dom'

const UpdateName = () => {

    const location = useLocation()
    const objectID = location.state
    console.log('ObjectID - ', objectID)

    useEffect(() => {
        console.log('LocationState - ', location.state)
    }, [])

  return (
    <div className='w-100 vh-50 '>
        <NameGenerate resourceID={objectID} operationType={'update'}/>
    </div>
  )
}

export default UpdateName