import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import "../static/menu.css"

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const logout = useLogout()
    const currentUrl = location.pathname

    const [hasSubtitle, setHasSubtitle] = useState(false)
    const [fullUrl, setFullUrl] = useState(window.location.href)
    const [subTitle, setSubTitle] = useState('')

    const handleClick = (address) => {
        if (address.includes('http')) {
            const urlObject = new URL(address)
            const destination = urlObject.pathname + urlObject.search
            navigate(`${destination}`)
        } else {
            navigate(`${address}`)
        }
    }

    const signOut = async () => {
        await logout()
        navigate('/login')
    }

    useEffect(() => {

        const linkColor = document.querySelectorAll('.nav_link')
        console.log('URL - ',currentUrl)
        console.log('Full URL - ',fullUrl)

        const removeColor = () => {
            if (linkColor) {
                linkColor.forEach(e => e.classList.remove('active'))
            }
        }

        removeColor()

        if (currentUrl) {
            const putColor = document.getElementById(currentUrl)
            if (putColor?.classList) putColor.classList.add('active')

            if (currentUrl === '/' || currentUrl === '/settings') {
                setHasSubtitle(false)
            } else {
                setHasSubtitle(true)
                setFullUrl(window.location.href)
                if (currentUrl === '/type-controll') {
                    const searchParams = new URLSearchParams(location.search)
                    const operationType = searchParams.get('action')
                    setSubTitle(operationType.charAt(0).toUpperCase() + operationType.slice(1))
                } else {
                    const sub = currentUrl.replace(/^\//, '')
                    setSubTitle(sub.charAt(0).toUpperCase() + sub.slice(1))
                }
            }
        }

    }, [currentUrl])

    useEffect(() => {
        const subColor = document.getElementById('subtitle')
        if (subColor?.classList) subColor.classList.add('active')
    }, [hasSubtitle, fullUrl])

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
                        <a onClick={() => handleClick('/')} id='/' class="nav_link">
                            <i class='bx bx-grid-alt nav_icon' />
                            <span class="nav_name">
                                Home
                            </span>
                        </a>
                        {hasSubtitle && (
                            subTitle === 'Update'
                                ? 
                                <a href={fullUrl} id='subtitle' class="nav_link">
                                    <i className='bx bx-grid-alt nav_icon' />
                                    <span className="nav_name">
                                        {subTitle}
                                    </span>
                                </a>
                                : 
                                <a onClick={() => handleClick(fullUrl)} id='subtitle' class="nav_link">
                                    <i className='bx bx-grid-alt nav_icon' />
                                    <span className="nav_name">
                                        {subTitle}
                                    </span>
                                </a>
                            
                        )}
                        <a onClick={() => handleClick('/settings')} id='/settings' class="nav_link">
                            <i class='bx bx-user nav_icon' />
                            <span class="nav_name">
                                Settings
                            </span>
                        </a>
                    </div>
                </div>
                <a class="nav_link btn btn-info text-light mx-4" onClick={signOut}>
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

export default Menu