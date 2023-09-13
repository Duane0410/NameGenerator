import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ViewCard = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const ID = location.state
    const searchParams = new URLSearchParams(location.search)
    const dataToView = searchParams.get('data')
    const [data, setData] = useState({})
    const [viewR, setViewR] = useState(true)

    const goBack = () => navigate(-1)

    useEffect(() => {
        if (!ID || !dataToView) {
            navigate('/')
        }
        if (dataToView === 'teams') {
            setViewR(false)
        }

    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3500/${dataToView}/` + ID)
            .then(response => {
                setData(response.data)
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [ID])

  return (
    <>
    {viewR
        ? 
        <div className="w-40 vh-25 p-5 rounded bg-white my-5">
            <h1 className='mb-3'>
                <b>Resource:</b>
            </h1>
            <b>ID:</b> {data._id}<br />
            <b>Date Created:</b> {data.date_created}<br />
            { data?.date_updated 
                ? <div><b>Date Updated:</b> {data.date_updated}<br /></div>
                : null}
            <b>Assigned By:</b> {data.assigned_by}<br />
            <b>Resource:</b> {data.resource}<br />
            <b>Name:</b> {data.name}<br />
            <b>Description:</b> {data.description}<br />
            <b>Location:</b> {data.location}<br />
            <br /><br />
            <button className='btn btn-primary mt-5' onClick={goBack}>Go Back</button>
        </div>
        : 
        <div className="w-40 vh-25 p-5 rounded bg-white mt-5 py-5">
            <h1 className='mb-3'>
                <b>Team:</b>
            </h1>
            <b>Team-ID:</b> {data.team_id}<br />
            <b>Leader:</b> {data.team_leader}<br /><br />
            <b>Members:</b>
            {data.team_members
                ? data.team_members.map((member, index) => 
                    <div key={index}><b>Member {index+1}:</b> {member}</div>
                )
                : <b>No members</b>
            }<br />
            <button className='btn btn-primary' onClick={goBack}>Go Back</button>
        </div>
    }
    </>
  )
}

export default ViewCard