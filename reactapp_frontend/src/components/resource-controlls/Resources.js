import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function Resources () {
    const { auth } = useAuth()

    const [data, setData] = useState()
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')

    useEffect(() => {
        let isMounted = true
        let resources = []
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
        const allowedRoles = [5001, 4001, 2001]
        if (!auth.roles.some(role => allowedRoles.includes(role))) {
            navigate('/unauthorized')
        } else {
            if (window.confirm("This resource will be permanently deleted. \nClick OK to confirm "))
            { 
            try {
                const response = await axiosPrivate.delete(`/resources/${ID}`)
                console.log(response)
                window.location.reload()
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
            </div>
            <div></div>

            <div className='w-100 bg-white-t rounded p-3 my-3' style={{width: '200%'}}>
                <Link 
                    // state={typeData}
                    to={`/create?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`}
                    // to = {'/'}
                    className='btn btn-success position-relative mb-1' 
                    style={{left: '85%', width: '15%'}}
                >Add <FontAwesomeIcon icon={faPlus} /></Link>
                <table className='table'>
                    <thead>
                        <tr>
                            <th className='px-3'>Date Created</th>
                            <th className='px-3'>Assigned By</th>
                            <th className='px-4'>Name</th>
                            <th className='px-5' >Actions</th>
                        </tr>
                    </thead>

                    {
                        data?.length
                            ? (
                                <tbody>
                                    {data.map((item, index) => 
                                        <tr key={index}>
                                            <td>{item?.date_created}</td>
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
                            ) : <tbody>
                                    <tr>
                                        <td>No Data</td>
                                    </tr>
                                </tbody>
                    }
                </table>
            </div>
        </div>
    )
}
export default Resources