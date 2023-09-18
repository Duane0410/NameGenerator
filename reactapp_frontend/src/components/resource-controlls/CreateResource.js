import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NameGenerate from './NameGenerate'
import axios from 'axios'
import CreatableSelect from 'react-select/creatable';

const DESC_REGEX = /^([A-Z][a-zA-Z0-9-_]{1,20}([ ][a-zA-Z0-9-_\n]{0,20}){0,100})$/

const CreateResource = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')
    const { auth } = useAuth() 
    const today = new Date().toISOString().split('T')[0];

    const locate = document.getElementById('location')
    const organize = document.getElementById('organization')

    const inputRef = useRef()
    const errRef = useRef()

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [show, setShow] = useState(false)

    const [located, setLocated] = useState('')
    const [validLocated, setValidLocated] = useState(false)

    const [organization, setOrganization]= useState('')
    const [validOrganization, setValidOrganization] = useState(false)
    
    const [description, setDescription] = useState('')
    const [validDescription, setValidDescription] = useState(false)
    const [descriptionFocus, setDescriptionFocus] = useState(false)

    const [tagsFocus, setTagsFocus] = useState(false)
    const [tags, setTags] = useState([])

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        if (!searchParams || !resource || !categories) navigate('/')
        inputRef.current.focus()
    }, [])

    useEffect(() => {
        if (located !== '--Select Location--') {
            setLocated(document.getElementById('location').value)
            setValidLocated(true)
            console.log('Location - ', located)
        } else {
            setValidLocated(false)
        }
    }, [located])

    useEffect(() => {
        if (organization !== '--Select Organization--') {
            setOrganization(document.getElementById('organization').value)
            setValidOrganization(true)
            console.log('Organization - ', organization)
        } else {
            setValidOrganization(false)
        }
    }, [organization])

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("team_id: ", auth.teamID)
        console.log("date_created: ", today)
        console.log('assigned_by: ', auth.user)
        console.log("resource: ", resource)
        console.log("name: ", name)
        console.log("description: ", description)
        console.log("location: ", located)
        console.log("category: ", category)
        console.log("tags: ", tags)
        let tempTags = []
        tags.map(tag => {
            tempTags.push(tag.value)
        })
        console.log("temp: ", tempTags)
        console.log("organizaion", organization)

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
                    "tags": tempTags,
                    "location": located,
                    "category": category,
                    "organization": organization
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
                    setErrMsg('Create Failed!')
                }
                errRef.current.focus()
            }
        }
    }

   return (
    <div className="d-flex-block justify-content-center align-items-center vh-100 bg-primary w-75" style={{"marginLeft": "15%"}}>
        <div className='bg-white rounded p-5'>
            <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                {errMsg}
            </p>
            <form onSubmit={handleSubmit} className='mx-4'>
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
                        placeholder=' Click the button below to choose a name'
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
                        <NameGenerate show={show} handleClose={handleClose} getName={getName}/>
                    </div>
                </div>

                <div className="mb-2 my-3">
                    <label htmlFor="leader" >
                        Location:
                        <span className={validLocated ? 'valid text-success' : 'd-none'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                    </label>
                    <select 
                        className='form-control' 
                        id='location'
                        onChange={() => setLocated(locate.value)}
                    >
                        <option value={null}>--Select Location--</option>
                        <option value='Panjim'>Panjim</option>
                        <option value='Verna'>Verna</option>
                        <option value='Margao'>Margao</option>
                    </select>
                </div>

                <div className="mb-2 my-3">
                    <label htmlFor="organization" >
                        Organization:
                        <span className={validOrganization ? 'valid text-success' : 'd-none'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                    </label>
                    <select 
                        className='form-control' 
                        id='organization'
                        onChange={() => setOrganization(organize.value)}
                    >
                        <option value={null}>--Select Organization--</option>
                        <option value='cl1'>Client 1</option>
                        <option value='cl2'>Client 2</option>
                        <option value='cl3'>Client 3</option>
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
                        placeholder=' Enter description'
                        id='description'
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        aria-describedby='descnote'
                        onFocus={() => setDescriptionFocus(true)}
                        onBlur={() => setDescriptionFocus(false)}
                    />
                    <p id='descnote' style={{fontSize: '0.75rem'}} className={descriptionFocus ? 'instructions text-success' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        State the function of the resource. 
                        Its purpose of creation. 
                        And what will it be used for.
                    </p>
                    <p id='descnote' style={{fontSize: '0.75rem'}} className={descriptionFocus && description && !validDescription ? 'instructions text-danger' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must start with a capital alpabet. 
                        Numbers and special characters are allowed.
                    </p>
                </div>

                <div className='mb-2 my-3'>
                    <label htmlFor='tags'>
                        Tags:
                    </label>
                    <CreatableSelect
                        isMulti
                        isClearable
                        id='tag'
                        className='form-control mb-1'
                        placeholder='Enter tags'
                        autoComplete='off'
                        onChange={(newValue) => setTags(newValue)}
                        aria-describedby='tagidnote'
                        onFocus={() => setTagsFocus(true)}
                        onBlur={() => setTagsFocus(false)}
                    />
                    <p id='tagidnote' style={{fontSize: '0.75rem'}} className={tagsFocus && tags ? 'instructions text-success' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Please enter tags for your new resource. 
                        Tags help categorize and describe your resource.
                    </p>
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary my-3" disabled={!name || !validLocated || !validOrganization || !validDescription ? true : false}>
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateResource