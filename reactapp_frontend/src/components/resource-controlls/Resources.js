import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'


function Resources () {

    const { auth } = useAuth()

    const [data, setData] = useState()
    const axiosPrivate = useAxiosPrivate()

    let resources = [];

    const navigate = useNavigate()
    const location = useLocation()
    // const typeData = location.state
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')


    const goBack = () => navigate('/');

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`/resources`, {
                    signal: controller.signal
                })
                if (response.data && isMounted) {
                    response.data.map(item => {
                        if (item.resource === resource) {
                            resources.push(item)
                        }
                    })
                    setData(resources);
                }
                console.log(response.data)
                // isMounted && setData(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        getData()

        return () => {
            isMounted = false
            controller.abort()
        }
    }, [])

    const handleDelete = async (ID) => {
        const allowedRoles = [5001, 4001]
        // console.log(!auth.roles.some(role => allowedRoles.includes(role)))
        // console.log('ResourceID - ', ID)
        if (!auth.roles.some(role => allowedRoles.includes(role))) {
            navigate('/unauthorized')
        } else {
            if (window.confirm("This resource will be permanently deleted. \nClick OK to confirm "))
            { 
            try {
                const response = await axios.delete(`http://localhost:3500/resources/${ID}`)
                console.log(response)
                window.location.reload()
                console.log('Trial')
            } catch (error) {
                console.error(error)
            } finally {
                console.log('Its the END')
            }
        }
      }
    }
    

    return (
        <div>
            <div className='heading'>
                <h1>{resource}</h1>
                <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>
                    Go back
                </button>
            </div>
            <div></div>

            <div className='w-100 bg-white rounded p-3 my-3' style={{width: '200%'}}>
                <Link 
                    // state={typeData}
                    to={`/create?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`}
                    // to = {'/'}
                    className='btn btn-success position-relative mb-1' 
                    style={{left: '80%', width: '20%'}}
                >Add +</Link>
                <table className='table'>
                    <thead>
                        <th>Date Created</th>
                        <th>Team-ID</th>
                        <th>Assigned By</th>
                        <th>Name</th>
                        <th className='px-5'>Actions</th>
                    </thead>

                    {
                        data?.length
                            ? (
                                <tbody>
                                    {data.map((item, index) => 
                                        <tr key={index}>
                                            <td>{item?.date_created}</td>
                                            <td>{item?.team_id}</td>
                                            <td>{item?.assigned_by}</td>
                                            <td>{item?.name}</td>
                                            <td>
                                                <Link 
                                                    state={item?._id}
                                                    to={`/view?data=${encodeURIComponent('resources')}`}
                                                    className='btn btn-info btn-block mx-4 my-1' 
                                                >View</Link>
                                                <Link 
                                                    state={item}
                                                    to={`/update?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`}
                                                    className='btn btn-success btn-block mx-4 my-1' 
                                                >Update</Link>
                                                <button 
                                                    onClick={(e) => handleDelete(item._id)}
                                                    className='btn btn-danger btn-block mx-4 my-1' 
                                                >Delete</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            ) : <p>No Data</p>
                    }
                </table>
            </div>
        </div>
    )
}
export default Resources