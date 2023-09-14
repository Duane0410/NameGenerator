import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from 'axios';
import "./menu.css"



const ScheduleForm = () => {
    const navigate = useNavigate();
    const logout = useLogout()

    const { auth } = useAuth()

    const [data, setData] = useState()
    const axiosPrivate = useAxiosPrivate()

    const signOut = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {
        let isMounted = true
        const controller = new AbortController()

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`/resource-types`, {
                    signal: controller.signal
                })
                console.log(response.data)
                isMounted && setData(response.data)
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

useEffect(()=>{

    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
        const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId)
        
        // Validate that all variables exist
        if(toggle && nav && bodypd && headerpd){
        toggle.addEventListener('click', ()=>{
        // show navbar
        nav.classList.toggle('show')
        // change icon
        toggle.classList.toggle('bx-x')
        // add padding to body
        bodypd.classList.toggle('body-pd')
        // add padding to header
        headerpd.classList.toggle('body-pd')
        })
        }
        }
        
        showNavbar('header-toggle','nav-bar','body-pd','header')
        
        /*===== LINK ACTIVE =====*/
        const linkColor = document.querySelectorAll('.nav_link')
        
        function colorLink(){
        if(linkColor){
        linkColor.forEach(l=> l.classList.remove('active'))
        this.classList.add('active')
        }
        }
        linkColor.forEach(l=> l.addEventListener('click', colorLink))
})


    const handleDelete = async (ID) => {
        const allowedRoles = [5001, 4001]
        // console.log(!auth.roles.some(role => allowedRoles.includes(role)))
        // console.log('ResourceID - ', ID)
        if (!auth.roles.some(role => allowedRoles.includes(role))) {
            navigate('/unauthorized')
        } else {
            if (window.confirm("All resources created under this type will be deleted. \nClick OK to confirm"))
           { 
            try {
                const response = await axios.delete(`http://localhost:3500/resource-types/${ID}`)
                console.log(response)
                window.location.reload()
                console.log('Trial')
            } catch (error) {
                console.error(error)
            } finally {
                console.log('Its the END')
            }
        }
      }
    }

  return (
    <div className='App'>
         {/* <header class="header" id="header">
        <div class="header_toggle"> <img></img><i class='bx bx-menu' id="header-toggle"></i> </div>
        <div class="header_img"> </div>
    </header> */}

 {/* <i class='bx bx-log-out nav_icon'></i> <span class="nav_name">SignOut</span>  */}

    <div class="l-navbar" id="nav-bar">
        <nav class="nav">
            <div> <a href="#" class="nav_logo"> <i class='bx bx-layer nav_logo-icon'></i> <span class="nav_logo-name">Menu</span> </a>
                <div class="nav_list"> <a href="#" class="nav_link active"> <i class='bx bx-grid-alt nav_icon'></i> <span class="nav_name">Home</span> </a> <a href="#" class="nav_link"> <i class='bx bx-user nav_icon'></i> <span class="nav_name">Settings</span> </a>  </div>
            </div> <a href="#" class="nav_link"> </a>
        </nav>
    </div>
        <div className='content'>
        <div className='heading'>
            <h1 className='text-light py-4 px-4'>Resources:</h1>
            <h4 className='position-absolute' style={{right: "20%"}}><em>Welcome {auth.user}!</em></h4>
            <button onClick={signOut} className="btn btn-danger position-absolute" style={{top: "10px", right: "20px"}}>
                Sign Out
            </button>
            <Link to='/teams' className="btn btn-outline-info position-absolute" style={{top: "80px", right: "20px"}}>
                Teams
            </Link>
        </div>

        {data?.length
            ? 
            <div className="d-flex flex-wrap">
                {data.map((item, index) => 
                    <div className="card card-container" style={{width: "18rem", margin: "0 10px 30px"}}>
                        <img src={item.image_url} class="card-img-top p-2" style={{height: "270px", width: "285px"}} />
                        <div className="card-body">
                            <h5 className="card-title">{item.resource_type}</h5>
                            <Link
                                to={`/resources?resource=${encodeURIComponent(item.resource_type)}&categories=${encodeURIComponent(item.name_categories)}`}
                                className="btn btn-info btn-block mx-1"
                            >View</Link>
                            <Link
                                state={item}
                                to={`/type-controll?action=${encodeURIComponent('update')}`}
                                className="btn btn-success btn-block mx-1"
                            >Update</Link>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className='btn btn-danger btn-block mx-1' 
                            >Delete</button>
                        </div>
                    </div>
                )}
                <div className="card card-container" style={{width: "18rem", margin: "0 10px 30px"}}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3876/3876052.png" class="card-img-top p-2" style={{height: "270px", width: "285px"}} />
                    <div className="card-body">
                        <h5 className="card-title"> Resource Type</h5>
                        <Link
                            to={`/type-controll?action=${encodeURIComponent('create')}`}
                            className="btn btn-primary btn-block w-100"
                        >Add +</Link>
                    </div>
                </div>
            </div>
            :
            <div className="d-flex">
                <div className="card card-container" style={{width: "18rem", margin: "0 10px 30px"}}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3876/3876052.png" class="card-img-top p-2" style={{height: "270px", width: "285px"}} />
                    <div className="card-body">
                        <h5 className="card-title">No Resources Added</h5>
                        <Link
                            to={`/type-controll?action=${encodeURIComponent('create')}`}
                            className="btn btn-primary btn-block w-100"
                        >Add +</Link>
                    </div>
                </div>
            </div>
        }
        </div>
        
    </div>
  )
}

export default ScheduleForm