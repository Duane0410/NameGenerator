import React, { useState } from 'react'
import useFetchData from '../hooks/useFetchData'

const BASE_URL = 'http://localhost:3500'

const Home = () => {
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
    </div>
  )
}

export default Home