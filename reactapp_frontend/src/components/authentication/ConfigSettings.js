import React from 'react'
import { useState, useEffect } from "react";
import axios from 'axios'
import useAuth from '../../hooks/useAuth';

const ConfigSettings = () => {
  const [emailOptions, setEmailOptions] = useState({})
  const { auth } = useAuth()
  const [initialCheckboxes, setInitialCheckboxes] = useState([])
  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);
  useEffect (async () => {
  try 
  {
    const resp = await axios.get(`http://localhost:3500/schedule/${auth.user}`)
    console.log('resp-',resp.data)
    setEmailOptions(resp.data)
  }
  catch(error)
  {
   console.log(error)
  }
    
  },[])

  useEffect ( () => {
    if(emailOptions){
      setInitialCheckboxes([
        { id: 'Weekly', label: 'Weekly', state: emailOptions.weekly },
        { id: 'Monthly', label: 'Monthly', state: emailOptions.monthly  },
        { id: 'Quarterly', label: 'Quarterly', state: emailOptions.quarterly  },
        { id: 'Yearly', label: 'Yearly', state: emailOptions.yearly },
        { id: 'updated_only', label: 'Updated resources only', state: emailOptions.updated_only },
      ])
    }
  },[emailOptions])

  useEffect ( () => {
    setCheckboxes(initialCheckboxes)
  },[initialCheckboxes])

  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, state: !checkbox.state } : checkbox
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(checkboxes)
    console.log('week',checkboxes[0].state)

    const response = await axios.put(`http://localhost:3500/schedule`, {
      "user": auth.user,
      "weekly": checkboxes[0].state, 
      "monthly": checkboxes[1].state, 
      "quarterly": checkboxes[2].state, 
      "yearly": checkboxes[3].state, 
      "updated_only": checkboxes[4].state
  }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
  })
  console.log(response)
  };

  return (
    <div>
      <div className='heading'>
        <h1 className='text-light py-4 px-4'>Configure Settings:</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {checkboxes.map((checkbox) => (
          <div className='heading' key={checkbox.id}>
            <span>
              <input
                type='checkbox'
                id={checkbox.id}
                name='topping'
                value={checkbox.id}
                checked={checkbox.state}
                onChange={() => handleCheckboxChange(checkbox.id)}/>
              {checkbox.state
                ? ` You will receive email ${checkbox.label}`
                : ` You will not receive email ${checkbox.label}`}.
            </span>
            <br/>
            <br/>
          </div>
        ))}
        <br/>
        <div>
          <button className="btn btn-info text-light mx-4">Reset</button> 
          <button type="submit" className="btn btn-info text-light mx-4">Save</button>
        </div>
       </form>
    </div>
  )
}

export default ConfigSettings