import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const ViewCard = () => {

    const axiosPrivate = useAxiosPrivate()
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
        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`${dataToView}/${ID}`)
                setData(response.data)
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        getData()
    }, [ID])

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
        {viewR
            ? 
            <div className="w-50 vh-25 p-5 rounded bg-white-l my-5">
                <h1 className='mb-3'>
                    <b>Resource:</b>
                </h1>
                <b>ID:</b> {data._id}<br />
                <b>Date Created:</b> {data.date_created}<br />
                {data?.date_updated 
                    ? <div><b>Date Updated:</b> {data.date_updated}<br /></div>
                    : null}
                <b>Assigned By:</b> {data.assigned_by}<br />
                <b>Resource:</b> {data.resource}<br />
                <b>Name:</b> {data.name}<br />
                <b>Description:</b> {data.description}<br />
                {data.tags?.length
                    ?<div><b>Tags:</b> {data.tags.join(', ')}<br /></div>
                    : null}
                <b>Location:</b> {data.location}<br />
                <br /><br />
                <button className='btn btn-primary mt-5' onClick={goBack}>Go Back</button>
            </div>
            : 
            <div className="w-40 vh-25 p-5 rounded bg-white-l mt-5 py-5">
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
    </div>
  )
}

export default ViewCard