import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import NameGenerate from './NameGenerate'
import axios from 'axios'
import CreatableSelect from 'react-select/creatable';

const DESC_REGEX = /^([A-Z][a-zA-Z0-9-_]{1,20}([ ][a-zA-Z0-9-_\n]{0,20}){0,100})$/

const UpdateResource = () => {
    const location = useLocation()
    const objectID = location.state
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')
    const today = new Date().toISOString().split('T')[0];
    
    const inputRef = useRef()
    const errRef = useRef()

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [show, setShow] = useState(false)

    const [description, setDescription] = useState('')
    const [validDescription, setValidDescription] = useState(false)
    const [descriptionFocus, setDescriptionFocus] = useState(false)
    
    const [tags, setTags] = useState([])
    const [hasTag, setHasTag] = useState(false)
    const [tagsFocus, setTagsFocus] = useState(false)

    const [organization, setOrganization]= useState('')
    const [hasChanged, setHasChanged] = useState(false)

    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        inputRef.current.focus()
        if (!searchParams || !resource || !categories) navigate('/')
        if (!objectID) {
            navigate(`/create?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
        }
    }, [])


    useEffect(() => {
        const result = DESC_REGEX.test(description)
        console.log('Results description - ', result)
        console.log('Description - ', description)
        setValidDescription(result)
        if (result) setHasChanged(true)
    }, [description])

    useEffect(() => {
        const result = tags.length ? true : false
        console.log('Results tags - ', result)
        console.log('Tags - ', tags)
        setHasTag(result)
        console.log('hasTags - ', hasTag)
        if (result) setHasChanged(true)
    }, [tags])
  
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const getName = (generatedName, nameCategory) => {
        setName(generatedName)
        setCategory(nameCategory)
        if (name !== objectID.name) setHasChanged(true)
    }

    const navigate = useNavigate()

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
        console.log("tags: ", tags)
        let tempTags = []
        if (tags.length) {
            tags.map(tag => {
                tempTags.push(tag.value)
            })
        } else {
            tempTags = objectID.tags
        }
        console.log("temp: ", tempTags)
        console.log("organizaion", organization)

        try {
            const response = await axios.put('http://localhost:3500/resources', {
                "_id": objectID._id,
                "team_id": objectID.team_id, 
                "date_updated": today, 
                "assigned_by": objectID.assigned_by, 
                "resource": objectID.resource, 
                "name": name,
                "description": description, 
                "tags": tempTags,
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
    <div className="d-flex-block justify-content-center align-items-center vh-100 bg-primary w-75" style={{"marginLeft": "15%"}}>
        <div className='bg-white rounded p-5'>
            <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                {errMsg}
            </p>
            <form onSubmit={handleSubmit} className='mx-4'>
                <h3 className="text-center">Update {resource}</h3>

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
                        Get Name
                    </Button>
                    <div className='d-none'>
                        <NameGenerate show={show} handleClose={handleClose} getName={getName}/>
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
                        Description: 
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
                        placeholder=' Enter description'
                        id='description'
                        onChange={(e) => setDescription(e.target.value)}
                        aria-describedby='descnote'
                        onFocus={() => setDescriptionFocus(true)}
                        onBlur={() => setDescriptionFocus(false)}
                    />
                    <p id='descnote' style={{fontSize: '0.75rem'}} className={description || descriptionFocus ? 'instructions text-success' : 'd-none'}>
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
                    {objectID.tags.length 
                        ? <input
                            type='text'
                            id='tag'
                            className='form-control mb-1'
                            value={objectID.tags}
                            disabled
                        />
                        : null}
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
                
                <div className="d-grid">
                    <button 
                        className="btn btn-primary my-3">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default UpdateResource