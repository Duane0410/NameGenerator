import React from 'react'
import { useState, useEffect } from "react";

const ConfigSettings = () => {

  const initialCheckboxes = [
    { id: 'Weekly', label: 'Weekly', state: false },
    { id: 'Monthly', label: 'Monthly', state: false },
    { id: 'Quarterly', label: 'Quarterly', state: false },
    { id: 'Yearly', label: 'Yearly', state: false },
    { id: 'updated_only', label: 'Updated resources only', state: false },
  ];

  const [checkboxes, setCheckboxes] = useState(initialCheckboxes);

  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, state: !checkbox.state } : checkbox
      )
    );
  };

  const handleSubmit = () => {
    // Handle form submission here if needed
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