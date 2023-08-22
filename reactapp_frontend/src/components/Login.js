import React from "react";
import { Link } from "react-router-dom";

function Login()
{
    return(
        <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
            <div className="w-40 p-5 rounded bg-white">
            <form>
                <h3 className="text-center">Sign In</h3>
                <div className="mb-2">
                <label htmlFor="email" >username</label>
                <input type="email" placeholder=" enter username" className="form-control"></input>
                </div>
                <div className="mb-2">
                <label htmlFor="password" >Password</label>
                <input type="password" placeholder=" enter password" className="form-control"></input> 
                </div>
                <div className="d-grid">
                       <button className="btn btn-primary">Sign-in</button>
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