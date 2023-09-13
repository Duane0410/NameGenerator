import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';

const CATEGORY_REGEX = /^[A-Z][a-z]{2,10}([ ][A-Z][a-z]{0,10}){0,1}$/
const TYPE_REGEX = /^([A-Z][a-z0-9]{1,14}[ ]{0,1}){1,4}$/
const URL_REGEX = /^(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?$/

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

    const [nameSelectCategory, setNameSelectCategory] = useState([])
    const [nameCategory, setNameCategory] = useState([])
    const [initialCheck, setInitialCheck] = useState(false)
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
        { value: 'Fictional Character', label: 'Fictional Character' },
        { value: 'Dessert', label: 'Dessert' }
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
        console.log('INIT nameSelectCategory - ', nameSelectCategory)

        if (nameSelectCategory.length === 0) {
            setInitialCheck(false)
            setValidNameCategory(false)
            console.log(`EMPTY Results nameCategory - `, validNameCategory)
            setNameCategory([])
            return
        }

        let count = 0
        setInitialCheck(true)
        nameSelectCategory.map(category => {
            const result = CATEGORY_REGEX.test(category.value)
            if (!result) {
                setValidNameCategory(result)
                console.log(`Results ${category.value} - `, result)
                count = count - 1
            } else {
                count = count + 1
            }
        })

        if (count === nameSelectCategory.length) {
            setValidNameCategory(true)
            console.log(`IF Results nameCategory - `, validNameCategory)
            console.log('IF nameSelectCategory - ', nameSelectCategory)
        } else {
            setValidNameCategory(false)
            console.log(`ELSE Results nameCategory - `, validNameCategory)
            console.log('ELSE nameSelectCategory - ', nameSelectCategory)
        }

        let tempCategory = []
        nameSelectCategory.map(category => {
            tempCategory.push(category.value)
        })
        setNameCategory(tempCategory)
        console.log('nameCategory - ', nameCategory)
        
        setHasChanged(true)
    }, [nameSelectCategory])

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
            console.log("nameCategory - ",nameCategory)
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
                    setErrMsg(error.response.data.message)
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
                    <h3 className="text-center"> Resource Type</h3>

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
                            <span className={validNameCategory || !initialCheck ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <CreatableSelect
                            isMulti
                            isClearable
                            options={options}
                            id='preference1'
                            className='form-control mb-1'
                            placeholder='Enter preferences'
                            autoComplete='off'
                            onChange={(newValue) => setNameSelectCategory(newValue)}
                            required
                            aria-invalid={validNameCategory ? 'false' : 'true'}
                            aria-describedby='catidnote'
                            onFocus={() => setNameCategoryFocus(true)}
                            onBlur={() => setNameCategoryFocus(false)}
                        />
                        <p id='catidnote' style={{fontSize: '0.75rem'}} className={nameCategoryFocus && nameSelectCategory && !validNameCategory ? 'instructions text-danger' : 'd-none'}>
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
                        <button disabled={!validResourceType || !validNameCategory || !validImageURL ? true : false} className="btn btn-primary">
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