import React, { useEffect, useRef, useState } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const ID_REGEX = /^[1-9][0-9]{0,2}$/
const NAME_REGEX = /^[A-Z][a-z]{3,7}([ ][A-Z][a-z]{0,10}){0,1}$/

const CreateUpdateTeam = () => {
    const location = useLocation()
    const team = location.state
    const searchParams = new URLSearchParams(location.search)
    const operationType = searchParams.get('action')
    const axiosPrivate = useAxiosPrivate()

    const inputRef = useRef()
    const errRef = useRef()

    const [teamID, setTeamID] = useState()
    const [validID, setValidID] = useState(false)
    const [IDFocus, setIDFocus] = useState(false)

    const [leader, setLeader] = useState('')
    const [validLeader, setValidLeader] = useState(false)
    const [leaderFocus, setLeaderFocus] = useState(false)

    const [numberOfMenbers, setNumberOfMembers] = useState(1)
    const [members, setMembers] = useState(Array(numberOfMenbers).fill(''))
    const [validMembers, setValidMembers] = useState(Array(numberOfMenbers).fill(false))
    const [membersFocus, setMembersFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [hasChanged, setHasChanged] = useState(false)
    const [isNew, setIsNew] = useState(true)

    const navigate = useNavigate()
    const goBack = () => navigate(`/teams`);
    
    useEffect(() => {
        if (operationType === 'update') {
            setIsNew(false)
            if (!team) {
                navigate('/')
            }
            setMembers(Array(team.team_members.length).fill(''))
            setValidMembers(Array(team.team_members.length).fill(false))
        }
        inputRef.current.focus()
    }, [])

    useEffect(() => {
        const result = ID_REGEX.test(teamID)
        console.log('Results ID - ', result)
        console.log('ID - ', teamID)
        setValidID(result)
    }, [teamID])

    useEffect(() => {
        const result = NAME_REGEX.test(leader)
        console.log('Results leader - ', result)
        console.log('leader - ', leader)
        setValidLeader(result)
        setHasChanged(true)
    }, [leader])

    useEffect(() => {
        const updatedValidMembers = [...validMembers]

        members.map((name, index) => {
            const result = NAME_REGEX.test(name)
            console.log(`Result member ${index + 1} - `, result)
            console.log(`member name ${index + 1} - `, name)
            if (result) {
                updatedValidMembers[index] = true
                console.log(`IF update ${index + 1} - `, updatedValidMembers[index])
                console.log(`IF ${index + 1} - `, validMembers[index])
            } else {
                updatedValidMembers[index] = false
                console.log(`ELSE ${index + 1} - `, validMembers[index])
            }
        })
        setValidMembers(updatedValidMembers)

        console.log('members - ', members)
        console.log('valid - ', validMembers)
        setHasChanged(true)
    }, [members])

    const hanldeMemberValid = () => {
        if (isNew) {
            let count = 0
            validMembers.map((valid) => {
                if (valid) {
                    count = count + 1
                } else {
                    count = count - 1
                }
            })
            
            if (count === validMembers.length) {
                return true
            } else {
                return false
            }
        } else {
            let value = false
            validMembers.forEach((valid, index) => {
                console.log(`Valid ${index} - `, valid)
                if (valid) {
                    value = true
                }
            })
            return value
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("team_id: ", teamID, "\nteam_leader: ", leader, "\nteam_members: ", members)

        if (!isNew) {
            if (!members) console.log('No input members!!!')
            if (teamID == null || teamID == undefined) setTeamID(team.team_id)
            if (leader === '') setLeader(team.team_leader)
            if (members == '' || members == [] || members == [''] || members === null) setMembers(team.team_members)
            const updatedMemberNames = team.team_members
            members.map((name, index) => {
                console.log(`Member ${index}`, name)
                if (name === '') {
                    console.log('Null at ', index + 1)
                    updatedMemberNames[index] = team.team_members[index]
                } else {
                    console.log('Value at ', index + 1)
                    updatedMemberNames[index] = name
                }
            })
            setMembers(updatedMemberNames)

            try {
                const response = await axiosPrivate.put('/teams', {
                    "team_id": teamID, "team_leader": leader, "team_members": members
                })
                console.log(JSON.stringify(response?.data))
                navigate(`/teams`)
            } catch (error) {
                console.log('Error response - ', error)
                if (!error?.response) {
                    setErrMsg('No Server Response!')
                } else if (error.response?.status === 409) {
                    setErrMsg('Conflict Error!')
                } else {
                    setErrMsg('Click Update again to Confirm!')
                }
                errRef.current.focus()
            }

        } else {
            try {
                const response = await axiosPrivate.post('/teams', {
                    "team_id": teamID, "team_leader": leader, "team_members": members
                })
                console.log(JSON.stringify(response?.data))
                navigate(`/teams`)
            } catch (error) {
                console.log('Error response - ', error)
                if (!error?.response) {
                    setErrMsg('No Server Response!')
                } else if (error.response?.status === 409) {
                    setErrMsg('Team ID Already Exists!')
                } else {
                    setErrMsg('Registration Failed!')
                }
                errRef.current.focus()
            }
        }
    }

  return (
    <div className="d-flex-block justify-content-center align-items-center vh-100">
        <div className='heading'>
            <button className="btn btn-dark position-absolute" onClick={goBack} style={{top: "10px", right: "20px"}}>Go back</button>
        </div>

        {isNew
            ?
            <div className='bg-white rounded p-5'>
                <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                    {errMsg}
                </p>
                <form  onSubmit={handleSubmit}>
                    <h3 className="text-center">Create Team</h3>
                    <div className="mb-2">
                        <label htmlFor="teamID" >
                            Team ID: 
                            <span className={validID ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validID || !teamID ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="number"
                            placeholder=" Enter team ID"
                            className="form-control mb-2"
                            id='teamID'
                            ref={inputRef}
                            autoComplete='off'
                            onChange={e => setTeamID(e.target.value)}
                            required
                            aria-invalid={validID ? 'false' : 'true'}
                            aria-describedby='tidnote'
                            onFocus={() => setIDFocus(true)}
                            onBlur={() => setIDFocus(false)}
                        />
                        <p id='tidnote' style={{fontSize: '0.75rem'}} className={IDFocus && teamID && !validID ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Team ID can be a number from 1-999.
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="leader" >
                            Leader Name: 
                            <span className={validLeader ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validLeader || !leader ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="text"
                            placeholder=" Enter leader name"
                            className="form-control mb-2"
                            id='leader'
                            autoComplete='off'
                            onChange={e => setLeader(e.target.value)}
                            required
                            aria-invalid={validLeader ? 'false' : 'true'}
                            aria-describedby='lidnote'
                            onFocus={() => setLeaderFocus(true)}
                            onBlur={() => setLeaderFocus(false)}
                        />
                        <p id='lidnote' style={{fontSize: '0.75rem'}} className={leaderFocus && leader && !validLeader ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Name can be entered as given name<br />
                            and surname seperated by a blank space.<br />
                            Given name can be 4 to 8 characters.<br />
                            Surname can be 0 to 10 characters.<br />
                            Must begin with a capital letter.<br />
                            Numbers, underscores, hyphens are not<br />
                            allowed.
                        </p>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="numberOfMembers">
                            Number of Team Members: 
                        </label>
                        <input
                            type='number'
                            id="numberOfMembers"
                            className='form-control'
                            min={1}
                            value={numberOfMenbers}
                            onChange={(e) => {
                                if (e.target.value > numberOfMenbers) {
                                    const count = parseInt(e.target.value) - numberOfMenbers
                                    setNumberOfMembers(parseInt(e.target.value))
                                    const updatedMemberNames = [...members]
                                    const updatedValidMembers = [...validMembers]
                                    for (let index = 0; index < count; index++) {
                                        updatedMemberNames.push('')
                                        updatedValidMembers.push(false)
                                    }
                                    setMembers(updatedMemberNames)
                                    setValidMembers(updatedValidMembers)
                                } else {
                                    const count = numberOfMenbers - parseInt(e.target.value)
                                    setNumberOfMembers(parseInt(e.target.value))
                                    const updatedMemberNames = [...members]
                                    const updatedValidMembers = [...validMembers]
                                    for (let index = 0; index < count; index++) {
                                        updatedMemberNames.pop()
                                        updatedValidMembers.pop()
                                    }
                                    setMembers(updatedMemberNames)
                                    setValidMembers(updatedValidMembers)
                                }
                                
                            }}
                        />
                    </div>

                    <div className="mb-2">
                        {members.map((name, index) => (
                            <div key={index}>
                                <label htmlFor={`member${index + 1}`}>
                                    {`Team Member ${index + 1}: `}
                                    <span className={validMembers[index] ? 'valid text-success' : 'd-none'}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={validMembers[index] || !members[index] ? 'd-none' : 'invalid text-danger'}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder=" Enter member name"
                                    className="form-control mb-2"
                                    autoComplete='off'
                                    id={`member${index + 1}`}
                                    onChange={(e) => {
                                        const updatedMemberNames = [...members]
                                        updatedMemberNames[index] = e.target.value
                                        setMembers(updatedMemberNames)
                                    }}
                                    required
                                    aria-invalid={validMembers[index] ? 'false' : 'true'}
                                    aria-describedby={`midnote${index + 1}`}
                                    onFocus={() => setMembersFocus(true)}
                                    onBlur={() => setMembersFocus(false)}
                                />
                                <p id={`midnote${index + 1}`} style={{fontSize: '0.75rem'}} className={membersFocus && members[index] && !validMembers[index] ? 'instructions text-danger' : 'd-none'}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Name can be entered as given name<br />
                                    and surname seperated by a blank space.<br />
                                    Given name can be 4 to 8 characters.<br />
                                    Surname can be 0 to 10 characters.<br />
                                    Must begin with a capital letter.<br />
                                    Numbers, underscores, hyphens are not<br />
                                    allowed.
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="d-grid">
                        <button disabled={!validID || !validLeader || !hanldeMemberValid() ? true : false} className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            </div>
            :
            <div className='bg-white rounded p-5'>
                <p ref={errRef} className={errMsg ? 'text-danger' : 'd-none'} aria-live='assertive'>
                    {errMsg}
                </p>
                <form  onSubmit={handleSubmit}>
                    <h3 className="text-center">Update Team</h3>
                    <div className="mb-2">
                        <label htmlFor="teamID" >
                            Team ID: 
                        </label>
                        <input 
                            type="number"
                            className="form-control mb-2"
                            id='teamID'
                            value={team.team_id}
                            onChange={e => setTeamID(e.target.value)}
                            readOnly
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor="leader" >
                            Leader Name: 
                            <span className={validLeader ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validLeader || !leader ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input 
                            type="text"
                            className="form-control mb-2"
                            id='leader'
                            value={team.team_leader}
                            onChange={e => setLeader(e.target.value)}
                            disabled
                        />
                        <input 
                            type="text"
                            placeholder=" Change leader name"
                            className="form-control mb-2"
                            id='leader'
                            ref={inputRef}
                            autoComplete='off'
                            onChange={e => setLeader(e.target.value)}
                            aria-invalid={validLeader ? 'false' : 'true'}
                            aria-describedby='lidnote'
                            onFocus={() => setLeaderFocus(true)}
                            onBlur={() => setLeaderFocus(false)}
                        />
                        <p id='lidnote' style={{fontSize: '0.75rem'}} className={leaderFocus && leader && !validLeader ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Name can be entered as given name<br />
                            and surname seperated by a blank space.<br />
                            Given name can be 4 to 8 characters.<br />
                            Surname can be 0 to 10 characters.<br />
                            Must begin with a capital letter.<br />
                            Numbers, underscores, hyphens are not<br />
                            allowed.
                        </p>
                    </div>

                    <div className="mb-2">
                        {team.team_members.map((name, index) => (
                            <div key={index}>
                                <label htmlFor={`member${index + 1}`}>
                                    {`Team Member ${index + 1}: `}
                                    <span className={validMembers[index] ? 'valid text-success' : 'd-none'}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </span>
                                    <span className={validMembers[index] || !members[index] ? 'd-none' : 'invalid text-danger'}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder=" Enter member name"
                                    className="form-control mb-2"
                                    autoComplete='off'
                                    id={`member${index + 1}`}
                                    value={name}
                                    disabled
                                />

                                <input
                                    type="text"
                                    placeholder=" Enter member name"
                                    className="form-control mb-2"
                                    autoComplete='off'
                                    id={`member${index + 1}`}
                                    onChange={(e) => {
                                        const updatedMemberNames = [...members]
                                        updatedMemberNames[index] = e.target.value
                                        setMembers(updatedMemberNames)
                                    }}
                                    aria-invalid={validMembers[index] ? 'false' : 'true'}
                                    aria-describedby={`midnote${index + 1}`}
                                    onFocus={() => setMembersFocus(true)}
                                    onBlur={() => setMembersFocus(false)}
                                />
                                <p id={`midnote${index + 1}`} style={{fontSize: '0.75rem'}} className={membersFocus && members[index] && !validMembers[index] ? 'instructions text-danger' : 'd-none'}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Name can be entered as given name<br />
                                    and surname seperated by a blank space.<br />
                                    Given name can be 4 to 8 characters.<br />
                                    Surname can be 0 to 10 characters.<br />
                                    Must begin with a capital letter.<br />
                                    Numbers, underscores, hyphens are not<br />
                                    allowed.
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="d-grid">
                        <button disabled={hasChanged && ((leader !== '' && validLeader) || (hanldeMemberValid())) ? false : true} className="btn btn-primary">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        }
    </div>
  )
}

export default CreateUpdateTeam