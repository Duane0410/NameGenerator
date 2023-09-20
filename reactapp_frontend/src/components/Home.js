import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const navigate = useNavigate();

    const { auth } = useAuth()

    const [data, setData] = useState()
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`/resource-types`, {
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
        const allowedRoles = [5001, 4001]
        if (!auth.roles.some(role => allowedRoles.includes(role))) {
            navigate('/unauthorized')
        } else {
            if (window.confirm("All resources created under this type will be deleted. \nClick OK to confirm")) { 
                try {
                    const response = await axiosPrivate.delete(`/resource-types/${ID}`)
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
    <div className='App'>

        <div className='heading'>
            <h1 className='text-light py-4 px-4'>Resources:</h1>
            <h4 className='position-absolute' style={{right: "5%"}}>Welcome {auth.user}!</h4>
        </div>

        {data?.length
            ? 
            <div className="d-flex flex-wrap" style={{'width': '118%'}}>
                {data.map((item, index) => 
                    <div key={index} className="card card-container" style={{width: "18rem", margin: "0 10px 30px"}}>
                        <img src={item.image_url} className="card-img-top p-2" style={{height: "270px", width: "285px"}} />
                        <div className="card-body">
                            <h5 className="card-title">{item.resource_type}</h5>
                            <Link
                                to={`/resources?resource=${encodeURIComponent(item.resource_type)}&categories=${encodeURIComponent(item.name_categories)}`}
                                className="btn btn-info btn-block mx-1"
                            >View</Link>
                            <Link
                                state={item}
                                to={`/update-type`}
                                className="btn btn-success btn-block mx-1"
                            >Update</Link>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className='btn btn-danger btn-block mx-1' 
                            >Delete</button>
                        </div>
                    </div>
                )}
                <div className="card card-container" style={{width: "18rem", margin: "0 10px 30px"}}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3876/3876052.png" className="card-img-top p-2" style={{height: "270px", width: "285px"}} />
                    <div className="card-body">
                        <h5 className="card-title">Resource Type</h5>
                        <Link
                            to={`/create-type`}
                            className="btn btn-primary btn-block w-100"
                        >Add <FontAwesomeIcon icon={faPlus} /></Link>
                    </div>
                </div>
            </div>
            :
            <div>
                <h1 className='text-light fs-4 py-4 px-4'>No Resources Added!</h1>
                
                <div className="d-flex">
                    <div className="card card-container" style={{width: "18rem", margin: "0 10px 30px"}}>
                        <img src="https://cdn-icons-png.flaticon.com/512/3876/3876052.png" className="card-img-top p-2" style={{height: "270px", width: "285px"}} />
                        <div className="card-body">
                            <h5 className="card-title">Resource Type</h5>
                            <Link
                                to={`/create-type`}
                                className="btn btn-primary btn-block w-100"
                            >Add <FontAwesomeIcon icon={faPlus} /></Link>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default Home