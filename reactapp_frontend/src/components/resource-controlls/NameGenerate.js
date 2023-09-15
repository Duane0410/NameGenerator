import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import useAuth from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useOpenAI from '../../hooks/useOpenAI'

const NameGenerate = ({ show, handleClose, getName }) => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const resource = searchParams.get('resource')
    const categories = searchParams.get('categories')
    const categoryArray = categories.split(',')
    const axiosPrivate = useAxiosPrivate()

    const [name, setName] = useState('')
    const [data, setData] = useState()
    const [errMsg, setErrMsg] = useState('')
    const [flag, setFlag] = useState(false)
    const [index, setIndex] = useState(0)
    const [position, setPosition] = useState(2)
    const [messages, setMessages] = useState([])
    const tempArray = useOpenAI(categoryArray[index])
    // const messages = useOpenAI(categoryArray[index])

    useEffect(() => {
        setMessages(tempArray)
        console.log("Temp - ", tempArray)
        console.log("Position - ", position)
        // setMessages([{message:"Hello", sender:"chatgpt"},{message:"Request", sender:"user"},{message:"[\"Aphrodite\", \"Apollo\", \"Ares\", \"Artemis\", \"Athena\"]", sender:"chatgpt"}])      // for trying!
        console.log('Initial - ', messages)
        // if (names) {
        //     handler()
        // }
    }, [index, tempArray])

    useEffect(() => {
        if (index !== 0) {
            setPosition(position + 2)
            console.log("New Position - ", position)
        }
    }, [index])
    
    const [names, setNames] = useState()
    // const [namesArray, setNamesArray] = useState()

    useEffect(() => {
        if (messages[position]?.message) {
            try {
                console.log('Message here - ', messages)
                const indexOne = messages[position].message.indexOf('[') - 1
                const indexTwo = messages[position].message.indexOf(']') + 1
                var namesString = messages[position].message.substring(indexOne, indexTwo)
                const indexThree = namesString.indexOf(']') - 1
                if (namesString[indexThree] === ',') namesString = namesString.slice(0, indexThree) + namesString.slice(indexThree + 1);
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
        // handler()
    }

    const handleSetName = async () => {
        getName(name, categoryArray[index])
        handleClose()
    }

    const handler = () => {
        if (names) {
            // console.log('Names Click - ', names)
            const isSubset = names.every(name => data.includes(name))
            console.log("test sub2 -", isSubset )
            if (isSubset) {
                setErrMsg(`Exhausted ${categoryArray[index]} names!!!`)
                // setName(`Would you like to move to category ${categoryArray[index+1]}`)

                return
            }

            setErrMsg(null)

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

  return (
    <div className='bg-white rounded p-3 my-3 generate'>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className='my-5'><b>Generate Name</b></h4>
                </Modal.Title>
            </Modal.Header>
            <div className='px-3 py-5 text-center'>
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
            <Modal.Footer className={(flag && errMsg) ? 'd-flex flex-row justify-content-center' : 'd-flex flex-row'}>
            {/* <Modal.Footer className='d-flex flex-row justify-content-center'> */}
                <Button variant='success' className={(flag && errMsg) ? 'btn btn-block py-1 fs-5' : 'd-none'} onClick={handleSwitch} disabled={flag ? false : true}>
                {/* <Button variant='success' className='btn btn-block py-1 fs-5 mr-auto p-2' onClick={handleSwitch} disabled={flag ? false : true}> */}
                    Switch to {categoryArray[index+1]} names
                </Button>
                <Button variant='success' className={(flag && name) ? 'btn btn-block py-1 fs-5 mr-auto mx-5' : 'd-none'} onClick={handleSetName} disabled={flag ? false : true}>
                {/* <Button variant='success' className='btn btn-block py-1 fs-5 mr-auto mx-5' onClick={handleSetName} disabled={flag ? false : true}> */}
                    Select
                </Button>
                <Button variant="secondary" className='btn btn-block py-1 fs-5 p-2' onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary"  className='btn btn-block py-1 fs-5 p-2' onClick={handler}>
                    Generate Name
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default NameGenerate
