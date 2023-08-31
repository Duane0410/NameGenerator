import React, { useEffect } from 'react'
import NameGenerate from './NameGenerate'
import { useLocation } from 'react-router-dom'

const UpdateName = () => {

    const location = useLocation()
    const object = location.state
    console.log('ObjectID - ', object._id)

    useEffect(() => {
        console.log('LocationState - ', location.state)
    }, [])

  return (
    <div className='w-100 vh-50'>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='w-50 bg-primary bg-white rounded p-3'>
            <h3 className="text-center">Update Name</h3>
            <input
              type="text"
              className="position-relative form-control fs-3 text-center"
              style={{left: '35%', width: '30%'}}
              value={object.name}
              readOnly
            />
          </div>
        </div>
        <NameGenerate resourceID={object} operationType={'update'}/>
    </div>
  )
}

export default UpdateName