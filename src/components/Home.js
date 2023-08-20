import React, { useState } from 'react'
import useFetchData from '../hooks/useFetchData'
import './style.css'

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
            <main>
                <nav>
                    <div className='leftNav' >
                        <ul>
                            <a href='/' ><li>CREATE</li></a>
                            <a href='/' ><li>READ</li></a>
                            <a href='/' ><li>UPDATE</li></a>
                            <a href='/' ><li>DELETE</li></a>
                        </ul>
                    </div>
                    <div className='rightNav' >
                        <button>LOGIN</button>
                    </div>
                </nav>
                <img className='backBanner' src={require('./1014.jpg')} alt='backBanner' />
                <div className='bannerContent'>
                    <div className='generateContainer'>
                        <div className='category'>
                            <label for="names">Choose a category </label>
                            <select name='category'>
                                <option value="River">River</option>
                                <option value="Planet">Planet</option>
                                <option value="Country">Country</option>
                                <option value="Monuments">Monuments</option>
                            </select>
                        </div>
                        <div className='generateBtn'>
                            <button className='btn' onClick={handler}>
                                Click Here
                            </button>
                            <h1>{name}</h1>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home