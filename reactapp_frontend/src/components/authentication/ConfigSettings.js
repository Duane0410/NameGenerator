import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const ConfigSettings = () => {
    const { auth } = useAuth()
    const [emailOptions, setEmailOptions] = useState({})

    const initialCheckBoxes = [
        { id: 'weekly', label: 'weekly', state: true },
        { id: 'wonthly', label: 'monthly', state: true },
        { id: 'quarterly', label: 'quarterly', state: true },
        { id: 'yearly', label: 'yearly', state: true },
        { id: 'updated_only', label: 'updated only', state: false }
    ]

    const [checkBoxes, setCheckBoxes] = useState(initialCheckBoxes);

    useEffect (() => {
        const getSchedule = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/schedule/${auth.user}`)
                console.log('response - ', response.data)
                setEmailOptions(response.data)
            }
            catch (error) {
                console.log(error)
            }
        }

        getSchedule()
    }, [])

    useEffect ( () => {
        if (emailOptions) {
            setCheckBoxes([
                { id: 'weekly', label: 'weekly', state: emailOptions.weekly },
                { id: 'monthly', label: 'monthly', state: emailOptions.monthly  },
                { id: 'quarterly', label: 'quarterly', state: emailOptions.quarterly  },
                { id: 'yearly', label: 'yearly', state: emailOptions.yearly },
                { id: 'updated_only', label: 'updated only', state: emailOptions.updated_only }
            ])
        }
    }, [emailOptions])

    const resetHandler = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.put(`http://localhost:3500/schedule`, {
                "user": auth.user,
                "weekly": initialCheckBoxes[0].state, 
                "monthly": initialCheckBoxes[1].state, 
                "quarterly": initialCheckBoxes[2].state, 
                "yearly": initialCheckBoxes[3].state, 
                "updated_only": initialCheckBoxes[4].state
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            setCheckBoxes(initialCheckBoxes)
            console.log(response)
            alert('Reset Condiguration!')
        } catch (error) {
            console.log(error)
        }
    }

    const saveHandler = async (e) => {
        e.preventDefault()

        console.log('user - ', auth.user)
        console.log('weekly - ', checkBoxes[0].state)
        console.log('monthly - ', checkBoxes[1].state)
        console.log('quarterly - ', checkBoxes[2].state)
        console.log('yearly - ', checkBoxes[3].state)
        console.log('updated_only - ', checkBoxes[4].state)

        try {
            const response = await axios.put(`http://localhost:3500/schedule`, {
                "user": auth.user,
                "weekly": checkBoxes[0].state, 
                "monthly": checkBoxes[1].state, 
                "quarterly": checkBoxes[2].state, 
                "yearly": checkBoxes[3].state, 
                "updated_only": checkBoxes[4].state
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            console.log(response)
            alert('Saved Condiguration!')
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className='bg-white w-75 rounded p-5 m-3 position-relative' style={{"left": "14%"}}>
        <div>
            <h1 className='p-4 mx-3'>Configure Email Settings:</h1>
        </div>
        <form className='px-5'>
            {checkBoxes.map((checkbox) => (
                <div key={checkbox.id} className="input-group mb-3">
                    <div className="input-group-text">
                        <input
                            type='checkbox'
                            id={checkbox.id}
                            className='form-check-input mt-0'
                            checked={checkbox.state}
                            onChange={() => {
                                setCheckBoxes((prevCheckBoxes) =>
                                    prevCheckBoxes.map((check) =>
                                        check.id === checkbox.id ? { ...check, state: !check.state } : check
                                    )
                                )
                            }}
                        />
                    </div>
                    <div className='form-control'>
                        {checkbox.id === 'updated_only'
                            ? checkbox.state
                                ? <span> You will receive an email about <strong>only the newly added or updated resources</strong> at the intervals checked above.</span>
                                : <span> You will receive an email about <strong>all resources</strong> at the intervals checked above.</span>
                            : checkbox.state
                                ? checkBoxes[4].state
                                    ? <span> You will receive a <strong>{checkbox.label}</strong> email about only newly added or updated resources in the database.</span>
                                    : <span> You will receive a <strong>{checkbox.label}</strong> email about all resources in the database.</span>
                                : <span> You will not receive any <strong>{checkbox.label}</strong> emails.</span>
                        }
                    </div>
                </div>
            ))}
            <br/>
            <div className='d-flex'>
                <button onClick={resetHandler} className="btn btn-primary w-50 btn-block mx-4">Reset</button> 
                <button onClick={saveHandler} className="btn btn-primary w-50 btn-block mx-4">Save</button>
            </div>
        </form>
    </div>
  )
}

export default ConfigSettings