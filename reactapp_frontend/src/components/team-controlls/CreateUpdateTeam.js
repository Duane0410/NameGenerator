import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'

const ID_REGEX = /^[1-9][0-9]{0,2}$/
const NAME_REGEX = /^[A-Z][a-z]{3,7}([ ][A-Z][a-z]{0,10}){0,1}$/
const MEMBER_REGEX = /^[A-Z][a-z]{3,7}([ ][A-Z][a-z]{0,10}){0,1}([,]{0,1}[A-Z][a-z]{3,7}([ ][A-Z][a-z]{0,10}){0,1}){0,4}$/

const CreateUpdateTeam = () => {
    const location = useLocation()
    const team = location.state
    const searchParams = new URLSearchParams(location.search)
    const operationType = searchParams.get('action')

    const inputRef = useRef()
    const errRef = useRef()

    const [teamID, setTeamID] = useState()
    const [validID, setValidID] = useState(false)
    const [IDFocus, setIDFocus] = useState(false)

    const [leader, setLeader] = useState('')
    const [validLeader, setValidLeader] = useState(false)
    const [leaderFocus, setLeaderFocus] = useState(false)

    const [membersInput, setMembersInput] = useState('')    
    const [validMembersInput, setValidMembersInput] = useState(false)
    const [membersInputFocus, setMembersInputFocus] = useState(false)

    const [members, setMembers] = useState([])

    const [errMsg, setErrMsg] = useState('')
    const [hasChanged, setHasChanged] = useState(false)
    const [isNew, setIsNew] = useState(true)

    const navigate = useNavigate()
    const goBack = () => navigate(`/teams`);
    
    useEffect(() => {
        if (operationType === 'update') {
            setIsNew(false)
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
        const result = MEMBER_REGEX.test(membersInput)
        console.log('Result members - ', result)
        console.log('members - ', membersInput)
        setValidMembersInput(result)
        setHasChanged(true)
        if (validMembersInput) {
            if (membersInput.indexOf(",")) {
                console.log('inputMem - ', membersInput)
                setMembers(membersInput.split(","))
            } else {
                setMembers([membersInput])
            }
        }
    }, [membersInput])

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("team_id: ", teamID, "\nteam_leader: ", leader, "\nteam_members: ", members)

        if (!isNew) {
            if (!membersInput) console.log('No input members!!!')
            if (teamID == null || teamID == undefined) setTeamID(team.team_id)
            if (leader === '') setLeader(team.team_leader)
            if (members == '' || members == [] || members == [''] || members === null) setMembers(team.team_members)

            try {
                const response = await axios.put('http://localhost:3500/teams', {
                    "team_id": teamID, "team_leader": leader, "team_members": members
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
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
                const response = await axios.post('http://localhost:3500/teams', {
                    "team_id": teamID, "team_leader": leader, "team_members": members
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
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
    <div className="d-flex justify-content-center align-items-center 100-w vh-100 bg-primary ">
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
                        <label htmlFor="members" >
                            Member Names: 
                            <span className={validMembersInput ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMembersInput || !membersInput ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <textarea 
                            type="text"
                            placeholder=" Enter member names"
                            className="form-control mb-2"
                            id='members'
                            autoComplete='off'
                            onChange={e => setMembersInput(e.target.value)}
                            required
                            aria-invalid={validMembersInput ? 'false' : 'true'}
                            aria-describedby='midnote'
                            onFocus={() => setMembersInputFocus(true)}
                            onBlur={() => setMembersInputFocus(false)}
                        />
                        <p id='midnote' style={{fontSize: '0.75rem'}} className={membersInputFocus && membersInput && !validMembersInput ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Follow all rules for names as for leader name.<br />
                            Seperate all member names with a comma(,).<br />
                            Each team can have 1 to 5 members.
                        </p>
                    </div>

                    <div className="d-grid">
                        <button disabled={!validID || !validLeader || !validMembersInput ? true : false} className="btn btn-primary">
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
                        <label htmlFor="members" >
                            Member Names: 
                            <span className={validMembersInput ? 'valid text-success' : 'd-none'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMembersInput || !membersInput ? 'd-none' : 'invalid text-danger'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <textarea 
                            type="text"
                            className="form-control mb-2"
                            id='members'
                            value={team.team_members}
                            onChange={e => setMembersInput(e.target.value)}
                            disabled
                        />
                        <textarea 
                            type="text"
                            placeholder=" Change member names"
                            className="form-control mb-2"
                            id='members'
                            autoComplete='off'
                            onChange={e => setMembersInput(e.target.value)}
                            aria-invalid={validMembersInput ? 'false' : 'true'}
                            aria-describedby='midnote'
                            onFocus={() => setMembersInputFocus(true)}
                            onBlur={() => setMembersInputFocus(false)}
                        />
                        <p id='midnote' style={{fontSize: '0.75rem'}} className={membersInputFocus && membersInput && !validMembersInput ? 'instructions text-danger' : 'd-none'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Follow all rules for names as for leader name.<br />
                            Seperate all member names with a comma(,).<br />
                            All names have to be written.<br />
                            Each team can have 1 to 5 members.
                        </p>
                    </div>

                    <div className="d-grid">
                        <button disabled={hasChanged && ((leader !== '' && validLeader) || (membersInput !== '' && validMembersInput)) ? false : true} className="btn btn-primary">
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