import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NameGenerate from './NameGenerate'
import axios from 'axios'

const CreateResource = () => {
    const location = useLocation()
    const objectID = location.state
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')
    console.log('ObjectID - ', objectID)
    const { auth } = useAuth() 
    const today = new Date().toISOString().split('T')[0];
    
    const inputRef = useRef()
    const errRef = useRef()

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [show, setShow] = useState(false)

    const [description, setDescription] = useState('')
    const [descriptionFocus, setDescriptionFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        inputRef.current.focus()
    }, [])
  
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const getName = (generatedName, nameCategory) => {
        setName(generatedName)
        setCategory(nameCategory)
    }

    const navigate = useNavigate()
    const goBack = () => navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`);

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("team_id: ", auth.teamID)
        console.log("date_created: ", today)
        console.log('assigned_by: ', auth.user)
        console.log("resource: ", resource)
        console.log("name: ", name)
        console.log("description: ", description)
        console.log("category: ", category)
        // team_id, date_created, assigned_by, resource, name, description, location, category 
        return

        if (auth.teamID === 0) {
            navigate('/unauthorized')
        } else {
            try {
                const response = await axios.post('http://localhost:3500/resources', {
                    "team_id": auth.teamID, 
                    "date_created": today, 
                    "assigned_by": auth.user, 
                    "resource": resource, 
                    "name": name,
                    "description": description, 
                    "category": category
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(JSON.stringify(response?.data))
                navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
            } catch (error) {
                console.error(error)
            }
        }
    }

   return (
    <div className="d-flex-block justify-content-center align-items-center vh-100 bg-primary">
        <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>

        <div className='bg-white rounded p-5'>
            <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                {errMsg}
            </p>
            <form onSubmit={handleSubmit}>
                <h3 className="text-center">Create {resource}</h3>
        
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
                <div className='d-grid'>
                    <label htmlFor='name'>
                        Name:
                        <span className={name ? 'valid text-success' : 'd-none'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                    </label>
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
                        <NameGenerate resourceID={objectID} operationType={'create'} show={show} handleClose={handleClose} getName={getName}/>
                    </div>
                </div>
                <div className="mb-2 my-3">
                    <label htmlFor="leader" >
                        Location:
                    </label>
                    <select className='form-control'>
                        <option value='Panjim'>Panjim</option>
                        <option value='Verna'>Verna</option>
                        <option value='Margao'>Margao</option>
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
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        aria-describedby='descnote'
                        onFocus={() => setDescriptionFocus(true)}
                        onBlur={() => setDescriptionFocus(false)}
                    />
                    <p id='descnote' style={{fontSize: '0.75rem'}} className={description || descriptionFocus ? 'instructions text-success' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        State the function of the resource.<br />
                        Its purpose of creation.<br />
                        And what will it be used for.
                    </p>
                </div>
                <div className="d-grid">
                    <button className="btn btn-primary my-3" disabled={!name || !location || !description ? true : false}>
                        Create
                    </button>
                </div>
            </form>
            {/* <div className='w-100 vh-50 '>
            <div className='d-flex justify-content-center align-items-center'>
            <div className='w-50 bg-primary bg-white rounded p-3'> */}
            {/* <NameGenerate resourceID={objectID} operationType={'create'} /> */}
        </div>
    </div>
  )
}

export default CreateResource