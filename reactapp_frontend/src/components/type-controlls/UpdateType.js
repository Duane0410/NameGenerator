import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const TYPE_REGEX = /^([A-Z][a-z0-9]{1,14}[ ]{0,1}){1,4}$/
const URL_REGEX = /^(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?$/

const UpdateType = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const location = useLocation()
    const typeData = location.state

    const inputRef = useRef()
    const errRef = useRef()

    const [resourceType, setResourceType] = useState('')
    const [validResourceType, setValidResourceType] = useState(false)
    const [resourceTypeFocus, setResourceTypeFocus] = useState(false)

    const [imageURL, setImageURL] = useState('')
    const [validImageURL, setValidImageURL] = useState(false)
    const [imageURLFocus, setImageURLFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [hasChanged, setHasChanged] = useState(false)
    
    useEffect(() => {
        inputRef.current.focus()
    }, [])

    useEffect(() => {
        const result = TYPE_REGEX.test(resourceType)
        console.log('Results resourceType - ', result)
        console.log('resourceType - ', resourceType)
        setValidResourceType(result)
        setHasChanged(true)
    }, [resourceType])

    useEffect(() => {
        const result = URL_REGEX.test(imageURL)
        console.log('Result imageURL - ', result)
        console.log('imageURL - ', imageURL)
        setValidImageURL(result)
        setHasChanged(true)
    }, [imageURL])

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("\nresource_type: ", resourceType, "\nimage_url: ", imageURL)

        if (!imageURL) console.log('No image URL!!!')
        if (resourceType === '') setResourceType(typeData.resource_type)
        if (imageURL === '') setImageURL(typeData.image_url)

        try {
            const response = await axiosPrivate.put('/resource-types', {
                "_id": typeData._id, "resource_type": resourceType, "image_url": imageURL
            })
            console.log(JSON.stringify(response?.data))
            navigate(`/`)
            window.location.reload()
        } catch (error) {
            console.log('Error response - ', error)
            if (!error?.response) {
                setErrMsg('No Server Response!')
            } else if (error.response?.status === 409) {
                setErrMsg('Conflict Error!')
            } else {
                setErrMsg('Click Update again to Confirm!')
            }
            errRef.current.focus()
        }
    }

  return (
    <div className="d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
        <div className='bg-white rounded p-5'>
            <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                {errMsg}
            </p>
            <form  onSubmit={handleSubmit}>
                <h3 className="text-center">Update Resource Type</h3>

                <div className="mb-2">
                    <label htmlFor="resourceType" >
                        Resource Type: 
                        <span className={validResourceType ? 'valid text-success' : 'd-none'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validResourceType || !resourceType ? 'd-none' : 'invalid text-danger'}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input 
                        type="text"
                        className="form-control mb-2"
                        id='resourceType'
                        value={typeData.resource_type}
                        onChange={e => setResourceType(e.target.value)}
                        disabled
                    />
                    <input 
                        type="text"
                        placeholder=" Change resource type"
                        className="form-control mb-2"
                        id='resourceType'
                        ref={inputRef}
                        autoComplete='off'
                        onChange={e => setResourceType(e.target.value)}
                        aria-invalid={validResourceType ? 'false' : 'true'}
                        aria-describedby='rtidnote'
                        onFocus={() => setResourceTypeFocus(true)}
                        onBlur={() => setResourceTypeFocus(false)}
                    />
                    <p id='rtidnote' style={{fontSize: '0.75rem'}} className={resourceTypeFocus && resourceType && !validResourceType ? 'instructions text-danger' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Resource type must begin with a capital<br />
                        letter.<br />
                        Underscores, hyphens are not<br />
                        allowed.
                    </p>
                </div>

                <div className="mb-2">
                    <label htmlFor="imageURL" >
                        Image URL: 
                        <span className={validImageURL ? 'valid text-success' : 'd-none'}>
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className={validImageURL || !imageURL ? 'd-none' : 'invalid text-danger'}>
                           <FontAwesomeIcon icon={faTimes} />
                        </span>
                    </label>
                    <input 
                        type="text"
                        className="form-control mb-2"
                        id='imageURL'
                        value={typeData.image_url}
                        onChange={e => setImageURL(e.target.value)}
                        disabled
                    />
                    <input 
                        type="text"
                        placeholder=" Change image URL"
                        className="form-control mb-2"
                        id='imageURL'
                        autoComplete='off'
                        onChange={e => setImageURL(e.target.value)}
                        aria-invalid={validImageURL ? 'false' : 'true'}
                        aria-describedby='imgidnote'
                        onFocus={() => setImageURLFocus(true)}
                        onBlur={() => setImageURLFocus(false)}
                    />
                    <p id='imgidnote' style={{fontSize: '0.75rem'}} className={imageURLFocus && imageURL && !validImageURL ? 'instructions text-danger' : 'd-none'}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must be a valid image URL.
                    </p>
                </div>

                <div className="d-grid">
                    <button disabled={hasChanged && ((resourceType !== '' && validResourceType) || (imageURL !== '' && validImageURL)) ? false : true} className="btn btn-primary">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>

  )
}

export default UpdateType