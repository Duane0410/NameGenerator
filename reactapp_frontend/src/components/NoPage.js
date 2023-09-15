import React from 'react'
import '../static/error.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

const NoPage = () => {
  return (
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="row w-40 h-75 my-5 p-5 rounded bg-white">
            <div class="col-md-12">
                <div class="error-template">
                    <h1 className='display-2'>
                        Oops!
                    </h1>
                    <h2 className='display-6 text-danger'>
                        404 Not Found!
                    </h2>
                    <div class="error-details">
                        Sorry, Requested page doesnot exist!
                    </div>
                    <div class="error-actions">
                        <a href="/" class="btn btn-primary btn-lg">
                            <span><FontAwesomeIcon icon={faHouse} /> </span>
                            Take Me Home 
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NoPage