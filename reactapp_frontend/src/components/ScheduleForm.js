import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import "../static/menu.css"

const ScheduleForm = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const logout = useLogout()
    const currentUrl = location.pathname

    const signOut = async () => {
        await logout()
        navigate('/login')
    }

useEffect(() => {

    const linkColor = document.querySelectorAll('.nav_link')
    console.log('URL - ',currentUrl)

    const removeColor = () => {
        if (linkColor) {
            linkColor.forEach(e => e.classList.remove('active'))
        }
    }

    removeColor()

    if (currentUrl) {
        const putColor = document.getElementById(currentUrl)
        if (putColor?.classList) putColor.classList.add('active')
    }

}, [])

  return (
    <div className='App nav-space'>

        <div class="l-navbar" id="nav-bar">
            <nav class="nav">
                <div> 
                    <div class="nav_logo"> 
                        <i class='bx bx-layer nav_logo-icon' /> 
                        <span class="nav_logo-name">
                            Menu
                        </span>
                    </div>

                    <div class="nav_list"> 
                        <a href="/" id='/' class="nav_link active">
                            <i class='bx bx-grid-alt nav_icon' />
                            <span class="nav_name">
                                Home
                            </span>
                        </a>
                        <a href="/settings" id='/settings' class="nav_link">
                            <i class='bx bx-user nav_icon' />
                            <span class="nav_name">
                                Settings
                            </span>
                        </a>
                    </div>
                </div>
                <a class="nav_link" onClick={signOut}>
                    Sign Out
                </a>
            </nav>
        </div>

        <div className='content'>
            <Outlet />
        </div>
    </div>
  )
}

export default ScheduleForm