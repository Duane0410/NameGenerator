import React, { useEffect, useRef, useState } from "react";
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const NAME_REGEX = /^[A-Z][a-z]{3,7}([ ][A-Z][a-z]{0,10}){0,1}$/
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
const EMAIL_REGEX =/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/

const REGISTER_URL = '/register'

function Register() {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const nameRef = useRef()
    const errRef = useRef()

    const [name, setName] = useState('')
    const [validName, setValidName] = useState(false)
    const [nameFocus, setNameFocus] = useState(false)

    const [user, setUser] = useState('')
    const [validUserName, setValidUserName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)

    const [pass, setPass] = useState('')
    const [validPass, setValidPass] = useState(false)
    const [passFocus, setPassFocus] = useState(false)
    
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        nameRef.current.focus()
    }, [])

    useEffect(() => {
        const result = NAME_REGEX.test(name)
        console.log('Results name - ', result)
        console.log('name - ', name)
        setValidName(result)
    }, [name])

    useEffect(() => {
        const result = USER_REGEX.test(user)
        console.log('Results user - ', result)
        console.log('Username - ', user)
        setValidUserName(result)
    }, [user])

    useEffect(() => {
        const result = PASS_REGEX.test(pass)
        console.log('Results pass - ', result)
        console.log('Password - ', pass)
        setValidPass(result)
    }, [pass])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email)
        console.log('Results email - ', result)
        console.log('Email - ', email)
        setValidEmail(result)
    }, [email])

    useEffect(() => {
        setErrMsg('')
    }, [name, user, pass])

    const handleSubmit = async (e) => {
        e.preventDefault()


        try {
            const response = await axiosPrivate.post(REGISTER_URL, 
                JSON.stringify({ "name": name, "user": user, "pass": pass, "email":email })
            )
            console.log(response.data)
            console.log(response.accessToken)
            console.log(JSON.stringify(response))

            setSuccess(true)
            navigate('/')
        } catch (error) {
            if (!success) {
                console.log('Error response - ', error)
                if (!error?.response) {
                    setErrMsg('No Server Response!')
                } else if (error.response?.status === 409) {
                    setErrMsg('Username Already Exists!')
                } else {
                    setErrMsg('Registration Failed!')
                }
                errRef.current.focus()
            }
        }
    }

    return(
        <div className="d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
            <div className="p-5 rounded bg-white">
                <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center">Register</h3>
                    
                    <div className="mb-2">
                        <label htmlFor="name" >
                            Name: 
                            <span className={validName ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validName || !name ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="text"
                            placeholder=" Enter name"
                            className="form-control mb-2"
                            id='name'
                            ref={nameRef}
                            autoComplete='off'
                            onChange={e => setName(e.target.value)}
                            required
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby='nidnote'
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                        />
                        <p id='nidnote' style={{fontSize: '0.75rem'}} className={nameFocus && name && !validName ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Name can be entered as given name<br />
                            and surname seperated by a blank space.<br />
                            Given name can be 4 to 8 characters.<br />
                            Surname can be 0 to 10 characters.<br />
                            Must begin with a capital letter.<br />
                            Numbers, underscores, hyphens are not<br />
                            allowed.
                        </p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" >
                            E-mail: 
                            <span className={validEmail ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail|| !email ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="text"
                            placeholder=" Enter email"
                            className="form-control mb-2"
                            id='email'
                            autoComplete='off'
                            onChange={e =>setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? 'false' : 'true'}
                            aria-describedby='Emailnote'
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id='Emailnote' style={{fontSize: '0.75rem'}} className={emailFocus && email && !validEmail ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Enter valid email id.<br />
                            
                        </p>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="username" >
                            Username: 
                            <span className={validUserName ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validUserName || !user ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="text"
                            placeholder=" Enter username"
                            className="form-control mb-2"
                            id='username'
                            autoComplete='off'
                            onChange={e => setUser(e.target.value)}
                            required
                            aria-invalid={validUserName ? 'false' : 'true'}
                            aria-describedby='uidnote'
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id='uidnote' style={{fontSize: '0.75rem'}} className={userFocus && user && !validUserName ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens<br />
                            allowed.
                        </p>
                    </div>

                    

                    <div className="mb-2">
                        <label htmlFor="password" >
                            Password: 
                            <span className={validPass ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPass || !pass ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            placeholder=" Enter password"
                            className="form-control mb-2"
                            id='password'
                            onChange={e => setPass(e.target.value)}
                            required
                            aria-invalid={validPass ? 'false' : 'true'}
                            aria-describedby='passnote'
                            onFocus={() => setPassFocus(true)}
                            onBlur={() => setPassFocus(false)}
                        />
                        <p id='passnote' style={{fontSize: '0.75rem'}} className={passFocus && !validPass ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase<br />
                            letters, a number and a special character.<br />
                            Allowed special characters:
                            <span aria-label='exclamation mark'>!</span>
                            <span aria-label='at symbol'>@</span>
                            <span aria-label='hashtag'>#</span>
                            <span aria-label='dollar sign'>$</span>
                            <span aria-label='percent'>%</span>
                        </p>
                    </div>

                    <div className="d-grid">
                        <button disabled={!validName || !validUserName || !validPass || !validEmail? true : false} className="btn btn-primary">
                            Sign up
                        </button>
                    </div>
                    <p className="text-end mt-2">
                        Already registered?<Link to='/login' className="ms-2">Sign in</Link>
                    </p>
                </form>
            </div>
            
        </div>
    )
 }

 export default Register