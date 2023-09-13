import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NameGenerate from './NameGenerate'

const UpdateResource = () => {
    const location = useLocation()
    const objectID = location.state
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')
    console.log('ObjectID - ', objectID)
    const { auth } = useAuth() 
    const today = new Date().toISOString().split('T')[0];
    const inputRef = useRef()
    const [name, setName] = useState('')
    const [show, setShow] = useState(false)

    useEffect(() => {
        inputRef.current.focus()
    }, [])
  
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const getName = (generatedName) => setName(generatedName)

    const navigate = useNavigate()
    const goBack = () => navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`);

   return (
    <div className="d-flex-block justify-content-center align-items-center vh-100 bg-primary">
        <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        
        <div className='bg-white rounded p-5'>
            {/* <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                {errMsg}
            </p> */}
            <form >
                <h3 className="text-center">Update {resource}</h3>
        
                <div className="mb-2">
                    <label htmlFor="teamID" >
                        Date of Creation:
                    </label>
                    <input
                        type="date"
                        className="form-control mb-2"
                        id='date'
                        value={today}
                        readOnly
                    />
                </div>
                
                <div className="mb-2">
                    <label htmlFor="teamID" >
                        Date of Last Updated:
                    </label>
                    <input
                        type="date"
                        className="form-control mb-2"
                        id='date'
                        value={today}
                        readOnly
                    />
                </div>

                <div className='d-grid'>
                    <label htmlFor='name'>
                        Name:
                    </label>
                    <input
                        type='text'
                        className='form-control mb-2'
                        id='name'
                        value={name}
                        disabled
                    />
                    <input
                        type='text'
                        className='form-control mb-2'
                        id='name'
                        value={name}
                        readOnly
                    />
                    <Button 
                        variant="primary" 
                        className='btn btn-primary btn-block'
                        onClick={handleShow}
                        ref={inputRef}
                    >
                        Get a name
                    </Button>
                    <div className='d-none'>
                        <NameGenerate resourceID={objectID} operationType={'update'} show={show} handleClose={handleClose} getName={getName}/>
                    </div>
                </div>
                <div className="mb-2 my-3">
                    <label htmlFor="leader" >
                        Location:
                    </label>
                    <select className='form-control'>
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
                        disabled
                    />
                    <textarea
                        type="text"
                        className="form-control mb-2"
                        id='members'
                    />
                </div>
                <div className="d-grid">
                    <button className="btn btn-primary my-3">
                        Update
                    </button>
                </div>
            </form>
            {/* <div className='w-100 vh-50 '>
            <div className='d-flex justify-content-center align-items-center'>
            <div className='w-50 bg-primary bg-white rounded p-3'> */}
            {/* <NameGenerate resourceID={objectID} operationType={'update'} /> */}
        </div>
    </div>
  )
}

export default UpdateResource