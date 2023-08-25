import React, { useState } from 'react'
import useLogout from '../hooks/useLogout';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout()

    const { auth } = useAuth()

    const signOut = async () => {
        await logout()
        navigate('/login')
    }

  return (
    <div className='App'>

        <div className='heading'>
            <h1 className='text-light py-4 px-4'>Resources:</h1>
            <h4 className='position-absolute' style={{right: "20%"}}>Welcome {auth.user}!</h4>
            <button onClick={signOut} className="btn btn-dark position-absolute" style={{top: "10px", right: "20px"}}>
                Sign Out
            </button>
        </div>

        <div className="row">
            <div className="card card-container" style={{width: "18rem", margin: "0 10px"}}>
                <img src="https://i0.wp.com/regroove.ca/stellark/wp-content/uploads/sites/3/2021/02/icon_1.0.1358.2031.png?fit=300%2C300&ssl=1" class="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Virtual Machines</h5>
                    <Link 
                        to={`/resources?resource=${encodeURIComponent('Virtual Machines')}`}
                        className="btn btn-primary"
                    >View</Link>
                </div>
            </div>

            <div className="card card-container" style={{width: "18rem", margin: "0 10px"}}>
                <img src="https://www.kindpng.com/picc/m/500-5000015_amazon-s3-bucket-icon-hd-png-download.png" className="card-img-top" style={{height: "263px", width: "270px"}} />
                <div className="card-body">
                    <h5 className="card-title">S3 Bucket</h5>
                    <Link 
                        to={`/resources?resource=${encodeURIComponent('S3 Bucket')}`}
                        className="btn btn-primary"
                    >View</Link>
                </div>
            </div>

            <div className="card card-container" style={{width: "18rem", margin: "0 10px"}}>
                <img src="https://cdn-icons-png.flaticon.com/512/6468/6468987.png" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Database Server Instance</h5>
                    <Link 
                        to={`/resources?resource=${encodeURIComponent('Database Server Instance')}`}
                        className="btn btn-primary"
                    >View</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Home