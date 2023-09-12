import React, { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'

const NewAddResource = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')

    const navigate = useNavigate()
    //const goBack = () => navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`);

    const { auth } = useAuth() 
   
    const today = new Date().toISOString().split('T')[0];

   return (
    <div className='bg-white rounded p-3 my-1 mb-2 '>


               <form >
                    <h3 className="text-center">Create New Resource</h3>
                    <div className="mb-2 my-5">
                        <label htmlFor="teamID" >
                          <b> Date of Creation: </b> 
                        </label>
                        <input 
                            type="date"
                            className="form-control mb-2"
                           id='date'
                           defaultValue='today'
                           readOnly
                        />
                        
                    </div>

                    <div className="mb-2 my-3">
                        <label htmlFor="leader" >
                           <b> Location: </b>
                        </label>
                        <select>
                            <option>Panjim</option>
                            <option>Verna</option>
                            <option>Margao</option>
                        </select>
                       </div>

                    <div className="mb-2 my-3">
                        <label htmlFor="members" >
                           <b> Description of Resource:</b>
                        </label>
                        <textarea 
                            type="text"
                            className="form-control mb-2"
                            id='members'
                        />
                    </div>

                    <div className="d-grid">
                        <button  className="btn btn-primary my-3">
                            Generate a name
                        </button>
                    </div>
                </form>
        {/* <form>
                    <h3 className="text-center">New Resource Name</h3>
                    <div className="mb-2">
                        <span> <label htmlFor="dateOfCreation" >
                            Date of creation:
                        </label></span>
                       <span><input 
                            type="number"
                            placeholder=" 12-09-2023"
                            className="form-control mb-2"
                            id='dateOfCreation'
                           readOnly
                        /></span>                    
                    </div>

                    <div class="form-group">
    <label for="exampleFormControlSelect1">Example select</label>
    <select class="form-control" id="exampleFormControlSelect1">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>

                    <div class="form-group">
                       <label for="exampleFormControlTextarea1">Example textarea</label>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                       </div>
                        
               
           
                </form> */}
        {/* <div className='heading'>
            <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        </div>
        <h1 className='my-5'><b>New Name</b></h1>
        <div className='row justify-content-center'>
            <button className='btn btn-success btn-block w-50 py-3 fs-4' onClick={handler}>
                Generate Name
            </button>

            <div className='px-3 py-5'>
                {name || errMsg
                    ? 
                    <div>
                        <p className={errMsg ? 'text-danger fs-3' : 'd-none'} aria-live='assertive'>
                            {errMsg}
                        </p>
                        <h2 className='display-6'>{name}</h2>
                    </div>
                    : <p className='display-6'>Loading...</p>
                }
            </div>
            <button className={(flag && errMsg) ? 'btn btn-success btn-block w-50 py-3 mb-3 fs-4' : 'd-none'} onClick={handleSwitch} disabled={flag ? false : true}>
                Switch to {categoryArray[index+1]} names
            </button><br />
            <button className={(flag && name) ? 'btn btn-success btn-block w-50 py-3 mb-3 fs-4' : 'invisible'} onClick={handleSetName} disabled={flag ? false : true}>
                Select
            </button>
        </div> */}
    </div>
  )
}

export default NewAddResource