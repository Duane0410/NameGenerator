import React,{Component} from "react";
import { Link } from "react-router-dom";

function Register()
{
        return(
            <div className="login template d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
            <div className="w-40 p-5 rounded bg-white">
            <form>
                <h3 className="text-center">Sign Up</h3>
                <div className="mb-2">
                <label htmlFor="email" >Name</label>
                <input type="text" placeholder=" enter name" className="form-control"></input>
                </div>
                <div className="mb-2">
                <label htmlFor="email" >Username</label>
                <input type="numeric" placeholder=" enter username" className="form-control"></input>
                </div>
                <div className="mb-2">
                <label htmlFor="email" >Password</label>
                <input type="email" placeholder=" enter password" className="form-control"></input>
                </div>
                <div className="d-grid">
                <Link to='/' className="ms-2"><button className="btn btn-primary">Register</button></Link>
                </div>
                <p className="text-end mt-2">
                    Already registered?<Link to='/' className="ms-2">Sign in</Link>
                </p>
            </form>
            </div>
            
        </div>
        )
 }

 export default Register