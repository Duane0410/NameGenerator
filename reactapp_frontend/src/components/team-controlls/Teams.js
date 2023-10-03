import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function Teams () {

    const [data, setData] = useState()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const goBack = () => navigate('/');

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`/teams`, {
                    signal: controller.signal
                })
                console.log(response.data)
                isMounted && setData(response.data)
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
        try {
            const response = await axiosPrivate.delete(`/teams/${ID}`)
            console.log(response)
            alert(`Deleted team with team ID ${ID}`)
            window.location.reload()
            console.log('Trial')
        } catch (error) {
            console.error(error)
        } finally {
            console.log('Its the END')
        }
    }
    

    return (
        <div className='mb-3'>
            <div className='heading'>
                <h1>Teams</h1>
                <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>
                    Go back
                </button>
            </div>
            <div></div>

            <div className='w-100 bg-white rounded p-3 my-3' style={{width: '200%'}}>
                <Link 
                    to={`/team-controll?action=${encodeURIComponent('create')}`}
                    className='btn btn-success position-relative mb-1' 
                    style={{left: '80%', width: '20%'}}
                >Add +</Link>
                <table className='table'>
                    <thead>
                        <tr>
                            <th className='px-3'>Team-ID</th>
                            <th className='px-4'>Leader</th>
                            <th className='px-3'>Members</th>
                            <th className='px-4'>Actions</th>
                        </tr>
                    </thead>

                    {
                        data?.length
                            ? (
                                <tbody>
                                    {data.map((item, index) => 
                                        <tr key={index}>
                                            <td>{item?.team_id}</td>
                                            <td>{item?.team_leader}</td>
                                            <td>
                                                {item?.team_members.length}
                                            </td>
                                            <td>
                                                <Link 
                                                    state={item?.team_id}
                                                    to={`/view?data=${encodeURIComponent('teams')}`}
                                                    className='btn btn-info btn-block mx-3' 
                                                >View</Link>
                                                <Link 
                                                    state={item}
                                                    to={`/team-controll?action=${encodeURIComponent('update')}`}
                                                    className='btn btn-success btn-block mx-3' 
                                                >Update</Link>
                                                <button 
                                                    onClick={(e) => handleDelete(item.team_id)}
                                                    className='btn btn-danger btn-block mx-3' 
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
export default Teams