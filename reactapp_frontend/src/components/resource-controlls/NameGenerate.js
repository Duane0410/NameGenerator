import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useOpenAI from '../../hooks/useOpenAI'

const NameGenerate = ({resourceID, operationType}) => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')
    const categoryArray = categories.split(',')
    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()
    const goBack = () => navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`);

    const { auth } = useAuth()
    const [name, setName] = useState('')
    const [data, setData] = useState()
    const [flag, setFlag] = useState(false)

    let index = 0


    const messages = useOpenAI(categoryArray[index])
    console.log('Message here - ', messages)
    const [names, setNames] = useState()
    const [namesArray, setNamesArray] = useState()

    useEffect(() => {
        if (messages[2]?.message) {
            try {
                const index = messages[2].message.indexOf('[') - 1
                const namesString = messages[2].message.substring(index)
                console.log('String - ', namesString)
                setNamesArray(JSON.parse(namesString));
                console.log('Names - ', namesArray);
                setFlag(true)
                
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        } else {
            console.log('Error retrieving names!')
        }
    }, [messages])

    let temp = []
    
    const handleSetName = async () => {

        console.log("team_id: ", auth.teamID, "\nresource: ", resource, "\nname: ", name, "\ncategory: ", categoryArray[index])

        if (auth.teamID === 0) {
            navigate('/unauthorized')
        } else {
            if (operationType === 'update') {
                try {
                    const response = await axios.put('http://localhost:3500/resources', {
                        "_id": resourceID, "team_id": auth.teamID, "resource": resource, "name": name, "category": categoryArray[index]
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    })
                    console.log(JSON.stringify(response?.data))
                    navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
                } catch (error) {
                    console.error(error)
                }
    
            } else if (operationType === 'create') {
                try {
                    const response = await axios.post('http://localhost:3500/resources', {
                        "team_id": auth.teamID, "resource": resource, "name": name, "category": categoryArray[index]
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    })
                    console.log(JSON.stringify(response?.data))
                    navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
                } catch (error) {
                    console.error(error)
                }
            } else {
                console.log('Service not available!')
            }
        }
    }

    const handler = () => {
        if (names) {
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
        } else {
            alert('Retrieving names!')
            console.log('Retrieving names!')
        }
        
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
                            temp.push(item.name)
                        }
                    })
                    setData([...temp]);
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

    useEffect(() => {
        if (namesArray) {
          setNames(namesArray)
            setFlag(true)
            console.log('sss-',namesArray)
            console.log("try",names)
            // if (names) console.log('sss-',namesArray)
        } else {
            setFlag(false)
        }
        console.log('Flag - ', flag)
        // console.log("try",names)
        let num = []
        const isSubset = (array1, array2) => 
          array2.every((element) => array1.includes(element));
        
        try {
            if (data && namesArray) {
                console.log("dataaa",data)
                //const Da = JSON.stringify(data[0].name)
                //console.log("Da",Da)
                console.log("try",isSubset(data,namesArray))
                data.map(item => {
                    namesArray.map(name => {
                        if (name === item) {
                            num.push(namesArray.indexOf(name))
                        }
                    })
                    console.log('num - ', num)
    
            })}
            if (namesArray) namesArray[num] = ''
        } catch (error) {
            console.log(error)
        }
        

        // Array.form(names).map((name, index) => {
        //     if ()
        // })
    }, [data, namesArray])

  return (
    <div className='bg-white rounded p-3 my-3 generate'>
        <div className='heading'>
            <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        </div>
        <h1 className='my-5'>Name Generator</h1>
        <div className='row justify-content-center'>
            <button className='btn btn-success btn-block w-50 py-3' onClick={handler}>
                Generate Name
            </button>

            <h2 className='px-3 py-5'>
                {name
                    ? name
                    : <p>Loading...</p>
                }
            </h2>

            <button className='btn btn-success btn-block w-50 py-3 mb-3' onClick={handleSetName} disabled={flag ? false : true}>
                Select
            </button>
        </div>
    </div>
  )
}

export default NameGenerate
