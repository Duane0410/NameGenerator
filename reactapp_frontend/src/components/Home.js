import React, { useState } from 'react'
import useFetchData from '../hooks/useFetchData'
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3500'

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout()

    const signOut = async () => {
        await logout()
        navigate('/login')
    }

    const [name, setName] = useState('')
    // const names = useFetchData(BASE_URL + '/celestial-bodies')
    const names = useFetchData(BASE_URL + '/rivers')

    const handler = () => {
        
        const randomName = () => {
            const randomIndex = Math.floor(Math.random() * names.length)
            return names[randomIndex]
        }

        let random = randomName()
        setName(random)

    }

  return (
    <div>
        <button onClick={handler}>
            Chick Here
        </button>
        <h1>{name}</h1>
        <button onClick={signOut} className="btn btn-primary">
            Sign Out
        </button>
    </div>
  )
}

export default Home