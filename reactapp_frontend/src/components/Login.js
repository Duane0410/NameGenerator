import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import axios from "../api/axios"

const LOGIN_URL = '/login'

function Login() {
    const { setAuth } = useContext(AuthContext)

    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pass])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(LOGIN_URL, 
                JSON.stringify({ "user": user, "pass": pass }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(JSON.stringify(response?.data))

            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles

            setAuth({ user, pass, roles, accessToken })
            
            setUser('')
            setPass('')
            setSuccess(true)
            
        } catch (error) {
            if (!success) {
                if (!error?.response) {
                    setErrMsg('No Server Response!')
                } else if (error.response?.status === 400) {
                    setErrMsg('Missing Username or Password!')
                } else if (error.response?.status === 401) {
                    setErrMsg('Unauthorized!')
                } else {
                    setErrMsg('Login Failed!')
                }
                errRef.current.focus()
            }
        }
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