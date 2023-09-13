import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import NameGenerate from './NameGenerate'

const NewAddResource = () => {
    // const categories = searchParams.get('categories')

    const location = useLocation()
    const objectID = location.state
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    console.log('ObjectID - ', objectID)

    const navigate = useNavigate()
    //const goBack = () => navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`);

    const { auth } = useAuth() 
   
    const today = new Date().toISOString().split('T')[0];

   return (
    <div className='bg-white rounded p-5'>
        {/* <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
            {errMsg}
        </p> */}
        <form >
            <h3 className="text-center">Create New Resource</h3>
            
            <div className="mb-2 my-5">
                <label htmlFor="teamID" >
                    Date of Creation: 
                </label>
                <input 
                    type="date"
                    className="form-control mb-2"
                    id='date'
                    defaultValue={today}
                    readOnly
                />
            </div>

            <div className="mb-2 my-3">
                <label htmlFor="leader" >
                    Location: 
                </label>
                <select>
                    <option>Panjim</option>
                    <option>Verna</option>
                    <option>Margao</option>
                </select>
            </div>

            <div className="mb-2 my-3">
                <label htmlFor="members" >
                    Description of Resource: 
                </label>
                <textarea 
                    type="text"
                    className="form-control mb-2"
                    id='members'
                /> 
            </div>

            <div className="d-grid">
                <button className="btn btn-primary my-3">
                    Generate a name
                </button>
            </div>
        </form>


        {/* <div className='w-100 vh-50 '>
        <div className='d-flex justify-content-center align-items-center'>
        <div className='w-50 bg-primary bg-white rounded p-3'> */}
        <NameGenerate resourceID={objectID} operationType={'create'} />
    </div>
  )
}

export default NewAddResource