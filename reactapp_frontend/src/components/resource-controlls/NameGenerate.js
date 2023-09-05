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
    const [errMsg, setErrMsg] = useState('')
    const [flag, setFlag] = useState(false)
    const [index, setIndex] = useState(0)
    // const [messages, setMessages] = useState([])
    const [tempArray, setTempArray] = useState(useOpenAI(categoryArray[index]))
    const messages = useOpenAI(categoryArray[index])

    useEffect(() => {
        // setMessages(tempArray)
        // setMessages([{message:"Hello", sender:"chatgpt"},{message:"Request", sender:"user"},{message:"[\"Aphrodite\", \"Apollo\", \"Ares\", \"Artemis\", \"Athena\"]", sender:"chatgpt"}])      // for trying!
        console.log('Initial - ', messages)
    }, [index])
    
    const [names, setNames] = useState()
    // const [namesArray, setNamesArray] = useState()

    useEffect(() => {
        if (messages[2]?.message) {
            try {
                console.log('Message here - ', messages)
                const index = messages[2].message.indexOf('[') - 1
                const namesString = messages[2].message.substring(index)
                console.log('String - ', namesString)
                setNames(JSON.parse(namesString));
                // setNames(namesString.split('\n'))
                // setNames(['Aurea','Apollo','Zeus'])  // for trying!
                console.log('Names - ', names);
                setFlag(true)
                
            } catch (error) {
                console.error("Error parsing JSON: ", error);
            }
        } else {
            console.log('Error retrieving names!')
        }
    }, [messages])

    const handleSwitch = () => {
        // setNames(null)
        setIndex(index + 1)
        // setMessages(categoryArray[index])
        handler()
    }

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
            console.log('Names Click - ', names)
            const isSubset = names.every(name => data.includes(name))
            console.log("test sub2 -", isSubset )
            if (isSubset) {
                setErrMsg(`Exhausted ${categoryArray[index]} names!!!`)
                // setName(`Would you like to move to category ${categoryArray[index+1]}`)

                return
            }

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
        let temp = []
        setIndex(0)
        // setMessages(tempArray)
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

    // useEffect(() => {
    //     if (namesArray) {
    //         setNames(namesArray)
    //         setFlag(true)
    //         console.log('trynamesArray - ',namesArray)
    //         console.log("trynames - ",names)
    //         // if (names) console.log('sss-',namesArray)
    //     } else {
    //         // setFlag(false)
    //         console.log('else')
    //     }
    //     console.log('Flag - ', flag)
    //     // console.log("try",names)
    //     // // let num = []
    //     // const isSubset = (array1, array2) => {array2.every((element) => array1.includes(element))};
        
    //     // try {
    //     //     if (data && names) {
    //     //         console.log("dataaa",data)
    //     //         //const Da = JSON.stringify(data[0].name)
    //     //         console.log("test Data - ",data)
    //     //         console.log("test Names - ",names)
    //     //         console.log("test sub -", names.every(name => data.includes(name)))
    //     //         data.map((item, index) => console.log(`data ${index} - ${item}`))
    //     //         names.map((item, index) => console.log(`name ${index} - ${item}`))
    //     //         // data.map(item => {
    //     //         //     namesArray.map(name => {
    //     //         //         if (name === item) {
    //     //         //             num.push(namesArray.indexOf(name))
    //     //         //         }
    //     //         //     })
    //     //         //     console.log('num - ', num)
    
    //     //     // })
    //     //     }
    //     //     // if (namesArray) namesArray[num] = '';
    //     // } catch (error) {
    //     //     console.log(error)
    //     // }
        

    //     // Array.form(names).map((name, index) => {
    //     //     if ()
    //     // })
    // }, [data, namesArray])

  return (
    <div className='bg-white rounded p-3 my-3 generate'>
        <div className='heading'>
            <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        </div>
        <h1 className='my-5'>Name Generator</h1>
        <div className='row justify-content-center'>
            <button className='btn btn-success btn-block w-50 py-3 fs-4' onClick={handler}>
                Generate Name
            </button>

            <div className='px-3 py-5'>
                {name || errMsg
                    ? 
                    <div>
                        <p className={errMsg ? 'text-danger fs-3' : 'd-none'} aria-live='assertive'>
                            {errMsg}
                        </p>
                        <h2 className='display-6'>{name}</h2>
                    </div>
                    : <p className='display-6'>Loading...</p>
                }
            </div>
            <button className={(flag && errMsg) ? 'btn btn-success btn-block w-50 py-3 mb-3 fs-4' : 'd-none'} onClick={handleSwitch} disabled={flag ? false : true}>
                Switch to {categoryArray[index+1]} names
            </button><br />
            <button className={(flag && name) ? 'btn btn-success btn-block w-50 py-3 mb-3 fs-4' : 'invisible'} onClick={handleSetName} disabled={flag ? false : true}>
                Select
            </button>
        </div>
    </div>
  )
}

export default NameGenerate
