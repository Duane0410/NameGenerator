import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NameGenerate from './NameGenerate'
import axios from 'axios'

const DESC_REGEX = /^([A-Z][a-zA-Z0-9-_]{1,20}([ ][a-zA-Z0-9-_\n]{0,20}){0,100})$/

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
    const errRef = useRef()

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [show, setShow] = useState(false)

    const [description, setDescription] = useState('')
    const [validDescription, setValidDescription] = useState(false)
    const [descriptionFocus, setDescriptionFocus] = useState(false)
    const [organization, setOrganization]= useState('')

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        inputRef.current.focus()
        if (!objectID) {
            navigate(`/create?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
        }
    }, [])


    useEffect(() => {
        const result = DESC_REGEX.test(description)
        console.log('Results description - ', result)
        console.log('Description - ', description)
        setValidDescription(result)
    }, [description])
  
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const getName = (generatedName, nameCategory) => {
        setName(generatedName)
        setCategory(nameCategory)
    }

    const navigate = useNavigate()
    const goBack = () => navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`);

    const getCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:3500/names`)
            console.log(response.data)
            response.data.map(item => {
                if (item.name === name) {
                    setCategory(item.category)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let locate = document.getElementById('location').value

        if (name === '' || name === null) setName(objectID.name)
        if (description === '' || description === null) setDescription(objectID.description)
        if (category === '' || category === null) getCategory()
        if (locate === '--Select Location--' || locate === null) {
            locate = objectID.location
        }

        console.log("_id: ", objectID._id)
        console.log("team_id: ", objectID.team_id)
        console.log("date_updated: ", today)
        console.log('assigned_by: ', objectID.assigned_by)
        console.log("resource: ", objectID.resource)
        console.log("name: ", name)
        console.log("description: ", description)
        console.log("location: ", locate)
        console.log("category: ", category)
        console.log("organizaion", organization)


        // return
        try {
            const response = await axios.put('http://localhost:3500/resources', {
                "_id": objectID._id,
                "team_id": objectID.team_id, 
                "date_updated": today, 
                "assigned_by": objectID.assigned_by, 
                "resource": objectID.resource, 
                "name": name,
                "description": description, 
                "location": locate,
                "category": category,
                "organization":organization

            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            console.log(JSON.stringify(response?.data))
            navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
        } catch (error) {
            console.log('Error response - ', error)
            if (!error?.response) {
                setErrMsg('No Server Response!')
            } else if (error.response?.status === 409) {
                setErrMsg('Name Already Exists!')
            } else {
                setErrMsg('Update Failed!')
            }
            errRef.current.focus()
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
                <h3 className="text-center">Update {resource}</h3>
        
                <div className="mb-2">
                    <label htmlFor="teamID" >
                        Date of Creation:
                    </label>
                    <input
                        type="date"
                        className="form-control mb-2"
                        id='date'
                        value={objectID.date_created}
                        readOnly
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="teamID" >
                        Date of Updation:
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
                        value={objectID.name}
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
                    <input
                        type='text'
                        className='form-control mb-2'
                        id='locate'
                        value={objectID.location}
                        disabled
                    />
                    <select className='form-control' id='location'>
                        <option value={null}>--Select Location--</option>
                        <option value='Panjim'>Panjim</option>
                        <option value='Verna'>Verna</option>
                        <option value='Margao'>Margao</option>
                    </select>
                </div>

                <div className="mb-2 my-3">
                    <label htmlFor="members" >
                        Description of Resource: 
                        <span className={validDescription ? 'valid text-success' : 'd-none'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validDescription || !description ? 'd-none' : 'invalid text-danger'}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <textarea
                        type="text"
                        className="form-control mb-2"
                        id='members'
                        value={objectID.description}
                        disabled
                    />
                    <textarea
                        type="text"
                        className="form-control mb-2"
                        id='members'
                        onChange={(e) => setDescription(e.target.value)}
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
                    <p id='descnote' style={{fontSize: '0.75rem'}} className={descriptionFocus && description && !validDescription ? 'instructions text-danger' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must start with a capital alpabet.<br />
                        Numbers and special characters are allowed.
                    </p>
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