import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Login() {

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pass])

    const handleSubmit = (e) => {
        e.preventDefault()
    }


    return(
        <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
            <div className="w-40 p-5 rounded bg-white">
                <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-center">Login</h3>
                    <div className="mb-2">
                        <label htmlFor="username" >Username: </label>
                        <input 
                            type="text"
                            placeholder=" Enter username"
                            className="form-control"
                            ref={userRef}
                            autoComplete="off"
                            onChange={e => setUser(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="password" >Password: </label>
                        <input 
                            type="password" 
                            placeholder=" Enter password" 
                            className="form-control"
                            onChange={e => setPass(e.target.value)}
                            required
                        /> 
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-primary">Sign In</button>
                    </div>
                    <p className="text-end mt-2">
                        Not registered yet?<Link to='/signup' className="ms-2">Sign Up</Link>
                    </p>
                </form>
            </div>
            
        </div>
    )
}

export default Login