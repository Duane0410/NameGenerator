import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import useFetchData from '../hooks/useFetchData'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


const BASE_URL = 'http://localhost:3001/'

const NameGenerate = ({resourceID}) => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const axiosPrivate = useAxiosPrivate()

    let pos = -1;
    if (resource === 'Virtual Machines') {
        pos = 0;
    } else if (resource === 'S3 Bucket') {
        pos = 1;
    } else if (resource === 'Database Server Instance') {
        pos = 2;
    }

    const navigate = useNavigate()
    const goBack = () => navigate(-1);

    const { auth } = useAuth()
    const [name, setName] = useState('')
    const [data, setData] = useState()
    // const [id, setId] = useState()
    const values = ["Greek Gods","Roman Gods","Celestial Bodies"]
    const url = BASE_URL + values[pos]
    const names = useFetchData(url)
    let temp = []
    
    const handleSetName = async () => {

        console.log("team_id: ", auth.teamID, "\nresource: ", resource, "\nname: ", name, "\ncategory: ", values[pos])

        if (resourceID) {
            try {
                const response = await axios.put('http://localhost:3500/resources', {
                    "_id": resourceID, "team_id": auth.teamID, "resource": resource, "name": name, "category": values[pos]
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(JSON.stringify(response?.data))
                navigate('/')
            } catch (error) {
                console.error(error)
            }

        } else {
            try {
                const response = await axios.post('http://localhost:3500/resources', {
                    "team_id": auth.teamID, "resource": resource, "name": name, "category": values[pos]
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
                console.log(JSON.stringify(response?.data))
                navigate('/')
            } catch (error) {
                console.error(error)
            }
        }
    }

    const handler = () => {
        const randomName = () => {
            const randomIndex = Math.floor(Math.random() * names.length)
            let newRandom = names[randomIndex]
            while (data.includes(newRandom)) {
                newRandom = randomName()
            }
            return newRandom
        }

        let random = randomName()
        setName(random)
    }

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`/names`, {
                    signal: controller.signal
                })
                if (response.data && isMounted) {
                    response.data.map(item => {
                        if (item.status === 'taken') {
                            temp.push(item)
                        }
                    })
                    setData(temp);
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

  return (
    <div className='w-100 vh-50 bg-white rounded p-3 my-3 generate'>
        <div className='heading'>
            <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        </div>
        <h1 className='my-5'>Name Generator</h1>
        <div className='row justify-content-center'>
            <button className='btn btn-success btn-block w-50 py-3' onClick={handler}>
                Generate Name
            </button>

            <h2 className='px-3 py-5'>
                {name}
            </h2>

            <button className='btn btn-success btn-block w-50 py-3' onClick={handleSetName}>
                Select
            </button>
        </div>
    </div>
  )
}

export default NameGenerate