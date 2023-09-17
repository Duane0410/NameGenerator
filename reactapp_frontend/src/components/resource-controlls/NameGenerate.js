import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useOpenAI from '../../hooks/useOpenAI'
import '../../static/name-gen.css'

const NameGenerate = ({ show, handleClose, getName }) => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
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

    useEffect(() => {
        setMessages(tempArray)
        console.log("Temp - ", tempArray)
        console.log("Position - ", position)
        console.log('Initial - ', messages)
    }, [index, tempArray])

    useEffect(() => {
        if (index !== 0) {
            setPosition(position + 2)
            console.log("New Position - ", position)
        }
    }, [index])
    
    const [names, setNames] = useState()

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
        setIndex(index + 1)
    }

    const handleSetName = async () => {
        getName(name, categoryArray[index])
        handleClose()
    }

    const handler = () => {
        if (names) {
            const isSubset = names.every(name => data.includes(name))
            console.log("test sub2 -", isSubset )
            if (isSubset) {
                setErrMsg(`Exhausted ${categoryArray[index]} names!!!`)
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
    <div className='generate'>
        <Modal show={show} onHide={handleClose} className='modal-container'>
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
                <Button variant='success' className={(flag && errMsg) ? 'btn btn-block py-1 fs-5' : 'd-none'} onClick={handleSwitch} disabled={flag ? false : true}>
                    Switch to {categoryArray[index+1]} names
                </Button>
                <Button variant='success' className={(flag && name) ? 'btn btn-block py-1 fs-5 mr-auto mx-5' : 'd-none'} onClick={handleSetName} disabled={flag ? false : true}>
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