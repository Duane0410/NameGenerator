import React, { useEffect } from 'react'
import NameGenerate from './NameGenerate'
import { useLocation } from 'react-router-dom'

const UpdateName = () => {

    const location = useLocation()
    const ID = location.state
    console.log('ObjectID - ', ID)

    useEffect(() => {
        console.log('LocationState - ', location.state)
    }, [])

  return (
    <div className='justify-content-center'>
        <NameGenerate resourceID={ID}/>

        
    </div>
  )
}

export default UpdateName