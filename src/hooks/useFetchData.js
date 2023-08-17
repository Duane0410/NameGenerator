import { useEffect, useState } from 'react'
import axios from 'axios'

const useFetchData = (url) => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`${url}`)
            .then(response => {
                setData(response.data)
            })
            .catch(error => {
                console.log(error)
                setData(['Error!','Failure!'])
            })
    }, [])

  return data
}

export default useFetchData