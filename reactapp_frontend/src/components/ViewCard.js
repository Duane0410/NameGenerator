import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ViewCard = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const ID = location.state
    const [resource, setResource] = useState({})

    const goBack = () => navigate(-1)

    useEffect(() => {
        axios.get('http://localhost:3500/resources/' + ID)
            .then(response => {
                setResource(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [ID])

  return (
    <div className="w-40 vh-25 p-5 rounded bg-white my-5">
        <h1 className='mb-3'>
            <b>Resource:</b>
        </h1>
        <b>ID:</b> {resource._id}<br />
        <b>Resource:</b> {resource.resource}<br />
        <b>Name:</b> {resource.name}<br />
        <br /><br />
        <button className='btn btn-primary mt-5' onClick={goBack}>Go Back</button>
    </div>
  )
}

export default ViewCard