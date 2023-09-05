import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';

const CATEGORY_REGEX = /^[A-Z][a-z]{2,10}([ ][A-Z][a-z]{0,10}){0,1}$/
const TYPE_REGEX = /^([A-Z][a-z0-9]{1,14}[ ]{0,1}){1,4}$/
const URL_REGEX = /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?$/

const CreateUpdateType = () => {
    const location = useLocation()
    const typeData = location.state
    const searchParams = new URLSearchParams(location.search)
    const operationType = searchParams.get('action')

    const inputRef = useRef()
    const errRef = useRef()

    const [resourceType, setResourceType] = useState('')
    const [validResourceType, setValidResourceType] = useState(false)
    const [resourceTypeFocus, setResourceTypeFocus] = useState(false)

    const [nameCategory, setNameCategory] = useState([])
    const [nameCategoryOne, setNameCategoryOne] = useState('')
    const [nameCategoryTwo, setNameCategoryTwo] = useState('')
    const [validNameCategory, setValidNameCategory] = useState(false)
    const [nameCategoryFocus, setNameCategoryFocus] = useState(false)

    const [imageURL, setImageURL] = useState('')
    const [validImageURL, setValidImageURL] = useState(false)
    const [imageURLFocus, setImageURLFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [hasChanged, setHasChanged] = useState(false)
    const [isNew, setIsNew] = useState(true)

    const options = [
        { value: 'Flower', label: 'Flower' },
        { value: 'Animal', label: 'Animal' },
        { value: 'Colour', label: 'Colour' },
      ]

    const navigate = useNavigate()
    const goBack = () => navigate(`/`);
    
    useEffect(() => {
        if (operationType === 'update') {
            setIsNew(false)
        } else {
            inputRef.current.focus()
        }
        
    }, [])

    useEffect(() => {
        const result = TYPE_REGEX.test(resourceType)
        console.log('Results resourceType - ', result)
        console.log('resourceType - ', resourceType)
        setValidResourceType(result)
        setHasChanged(true)
    }, [resourceType])

    useEffect(() => {
        const result1 = CATEGORY_REGEX.test(nameCategoryOne)
        const result2 = CATEGORY_REGEX.test(nameCategoryTwo)
        console.log('Results nameCategoryOne - ', result1)
        console.log('nameCategoryOne - ', nameCategoryOne)
        console.log('Results nameCategoryTwo - ', result2)
        console.log('nameCategoryTwo - ', nameCategoryTwo)
        console.log('Check 1 - ', validNameCategory)
        setValidNameCategory((nameCategoryOne!==nameCategoryTwo)&&(result1 && result2))
        console.log('Check 2 - ', validNameCategory)
        try {
            if (validNameCategory) {
                setNameCategory([nameCategoryOne, nameCategoryTwo])
            } else {
                console.log('Check 3 - ', validNameCategory)
            }
        } catch {
            console.log('The catch')
        }
        
        setHasChanged(true)
    }, [nameCategoryOne, nameCategoryTwo])

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

        if (!isNew) {
            if (!imageURL) console.log('No image URL!!!')
            if (resourceType === '') setResourceType(typeData.resource_type)
            if (imageURL === '') setImageURL(typeData.image_url)

            try {
                const response = await axios.put('http://localhost:3500/resource-types', {
                    "_id": typeData._id, "resource_type": resourceType, "image_url": imageURL
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(JSON.stringify(response?.data))
                navigate(`/`)
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

        } else {
            console.log("namecat",nameCategory)
            try {
                const response = await axios.post('http://localhost:3500/resource-types', {
                    "resource_type": resourceType, "name_categories": nameCategory , "image_url": imageURL
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(JSON.stringify(response?.data))
                navigate(`/`)
            } catch (error) {
                console.log('Error response - ', error)
                if (!error?.response) {
                    setErrMsg('No Server Response!')
                } else if (error.response?.status === 409) {
                    setErrMsg('Category Already Taken!')
                } else {
                    setErrMsg('Registration Failed!')
                }
                errRef.current.focus()
            }
        }
    }

  return (
    <div className="d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
        <div className='heading'>
            <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        </div>

        {isNew
            ?
            <div className='bg-white rounded p-5'>
                <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center">Create Type</h3>

                    <div className="mb-2">
                        <label htmlFor="resourceType" >
                            Resource Type 
                            <span className={validResourceType ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validResourceType || !resourceType ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="text"
                            placeholder=" Enter resource type"
                            className="form-control mb-2"
                            id='resourceType'
                            ref={inputRef}
                            autoComplete='off'
                            onChange={e => setResourceType(e.target.value)}
                            required
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

                    <div className='mb-2'>
                        <label htmlFor='category'>
                            Prefered Categories:
                            <span className={validNameCategory ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validNameCategory || (!nameCategoryOne && !nameCategoryTwo) ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <CreatableSelect
                             isClearable
                             options={options}
                             id='preference1'
                             className='form-control mb-1'
                             placeholder='First preference'
                             autoComplete='off'
                             onChange={(selectedOption) => {
                             if (selectedOption) {
                                     // Handle the selected option here
                              setNameCategoryOne(selectedOption.value); // Assuming value is the desired data to capture
                                } else {
                                     // Handle clearing the selection (if needed)
                              setNameCategoryOne(''); // Set to an empty string or null, depending on your use case
                                 }
                                }}
                                required
                              aria-invalid={validNameCategory ? 'false' : 'true'}
                              aria-describedby='catidnote'
                              onFocus={() => setNameCategoryFocus(true)}
                              onBlur={() => setNameCategoryFocus(false)}
                             />
                             <CreatableSelect
                             isClearable
                             options={options}
                             id='preference1'
                             className='form-control mb-1'
                             placeholder='First preference'
                             autoComplete='off'
                             onChange={(selectedOption) => {
                             if (selectedOption) {
                                     // Handle the selected option here
                              setNameCategoryTwo(selectedOption.value); // Assuming value is the desired data to capture
                                } else {
                                     // Handle clearing the selection (if needed)
                              setNameCategoryTwo(''); // Set to an empty string or null, depending on your use case
                                 }
                                }}
                                required
                              aria-invalid={validNameCategory ? 'false' : 'true'}
                              aria-describedby='catidnote'
                              onFocus={() => setNameCategoryFocus(true)}
                              onBlur={() => setNameCategoryFocus(false)}
                             />
                        {/* <input 
                            type='text'
                            id='preference1'
                            className='form-control mb-1'
                            placeholder='First preference'
                            autoComplete='off'
                            onChange={e => setNameCategoryOne(e.target.value)}
                            required
                            aria-invalid={validNameCategory ? 'false' : 'true'}
                            aria-describedby='catidnote'
                            onFocus={() => setNameCategoryFocus(true)}
                            onBlur={() => setNameCategoryFocus(false)}
                        /> */}
                        
                        
                        <p id='catidnote' style={{fontSize: '0.75rem'}} className={nameCategoryFocus && (nameCategoryOne || nameCategoryTwo) && !validNameCategory ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Two preferences for name generation<br />
                            category must be given.<br />
                            Must begin with a capital letter.<br />
                            Do not use plural.<br />
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
                            placeholder=" Enter image URL"
                            className="form-control mb-2"
                            id='imageURL'
                            autoComplete='off'
                            onChange={e => setImageURL(e.target.value)}
                            required
                            aria-invalid={validImageURL ? 'false' : 'true'}
                            aria-describedby='imgidnote'
                            onFocus={() => setImageURLFocus(true)}
                            onBlur={() => setImageURLFocus(false)}
                        />
                        <p id='imgidnote' style={{fontSize: '0.75rem'}} className={imageURLFocus && imageURL && !validImageURL ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be a valid URL.
                        </p>
                    </div>

                    <div className="d-grid">
                        <button disabled={!validResourceType || !validImageURL ? true : false} className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
            :
            <div className='bg-white rounded p-5'>
                <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                    {errMsg}
                </p>
                <form  onSubmit={handleSubmit}>
                    <h3 className="text-center">Update Type</h3>

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
                            Must be a valid URL<br />
                            Seperate all member names with a comma(,).<br />
                            All names have to be written.<br />
                            Each team can have 1 to 5 imageURL.
                        </p>
                    </div>

                    <div className="d-grid">
                        <button disabled={hasChanged && ((resourceType !== '' && validResourceType) || (imageURL !== '' && validImageURL)) ? false : true} className="btn btn-primary">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        }
    </div>

  )
}

export default CreateUpdateType