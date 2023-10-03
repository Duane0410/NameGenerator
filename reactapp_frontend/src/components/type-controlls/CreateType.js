import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const CATEGORY_REGEX = /^[A-Z][a-z]{2,10}([ ][A-Z][a-z]{0,10}){0,1}$/
const TYPE_REGEX = /^([A-Z][a-z0-9]{1,14}[ ]{0,1}){1,4}$/
const URL_REGEX = /^(https:\/\/)([^\s(["<,>/]*)(\/)[^\s[",><]*(.png|.jpg)(\?[^\s[",><]*)?$/

const CreateType = () => {

    const axiosPrivate = useAxiosPrivate()

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

    const options = [
        { value: 'Flower', label: 'Flower' },
        { value: 'Animal', label: 'Animal' },
        { value: 'Colour', label: 'Colour' },
        { value: 'Fictional Character', label: 'Fictional Character' },
        { value: 'Dessert', label: 'Dessert' }
    ]

    const navigate = useNavigate()
    
    useEffect(() => {
        inputRef.current.focus()
    }, [])

    useEffect(() => {
        const result = TYPE_REGEX.test(resourceType)
        setValidResourceType(result)
    }, [resourceType])

    useEffect(() => {
        if (nameSelectCategory.length === 0) {
            setInitialCheck(false)
            setValidNameCategory(false)
            setNameCategory([])
            return
        }

        let count = 0
        setInitialCheck(true)
        nameSelectCategory.map(category => {
            const result = CATEGORY_REGEX.test(category.value)
            if (!result) {
                setValidNameCategory(result)
                count = count - 1
            } else {
                count = count + 1
            }
        })

        if (count === nameSelectCategory.length) {
            setValidNameCategory(true)
        } else {
            setValidNameCategory(false)
        }

        let tempCategory = []
        nameSelectCategory.map(category => {
            tempCategory.push(category.value)
        })
        setNameCategory(tempCategory)
        
    }, [nameSelectCategory])

    useEffect(() => {
        const result = URL_REGEX.test(imageURL)
        setValidImageURL(result)
    }, [imageURL])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axiosPrivate.post('/resource-types', {
                "resource_type": resourceType, "name_categories": nameCategory , "image_url": imageURL
            })
            console.log(JSON.stringify(response?.data))
            navigate(`/`)
            window.location.reload()
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

  return (
    <div className="d-flex justify-content-center align-items-center 100-w vh-100">
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
                        className='mb-1'
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
                        Must be a valid image URL.
                    </p>
                </div>

                <div className="d-grid">
                    <button disabled={!validResourceType || !validNameCategory || !validImageURL ? true : false} className="btn btn-primary">
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateType