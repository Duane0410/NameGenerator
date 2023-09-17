import React, { useEffect, useState } from 'react'
import useLogout from '../hooks/useLogout';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
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
        if (address === 'resources') {
            const searchParams = new URLSearchParams(location.search)
            const resource = searchParams.get('resource')
            const categories = searchParams.get('categories')
            navigate(`/resources?resource=${encodeURIComponent(resource)}&categories=${encodeURIComponent(categories)}`)
        } else if (address.includes('http')) {
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
                if (currentUrl.includes('-')) {
                    const words = currentUrl.split(/[-/]/)
                    const sub = words.map(word => {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    }).join(' ')
                    setSubTitle(sub)
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

        <div className="l-navbar menu" id="nav-bar">
            <nav className="nav">
                <div> 
                    <div className="nav_logo"> 
                        <i className='bx bx-layer nav_logo-icon' />
                        <span className="nav_logo-name">
                            Infrastructure resource name generator
                        </span>
                    </div>

                    <div className="nav_list"> 
                        <a href='/' id='/' className="nav_link">
                            <i className='bx bx-grid-alt nav_icon' />
                            <span className="nav_name">
                                Home
                            </span>
                        </a>
                        {hasSubtitle && (
                            (subTitle === 'Update' || subTitle === 'Create' || subTitle === ' Update Type')
                                ? 
                                (subTitle === ' Update Type')
                                    ?
                                    <a href={fullUrl} id='subtitle' className="nav_link">
                                        <i className='bx bx-grid-alt nav_icon' />
                                        <span className="nav_name">
                                            {subTitle}
                                        </span>
                                    </a>
                                    :
                                    <>
                                        <a onClick={() => handleClick('resources')} className="nav_link">
                                            <i className='bx bx-grid-alt nav_icon' />
                                            <span className="nav_name">
                                                Resources
                                            </span>
                                        </a>
                                        <a href={fullUrl} id='subtitle' className="nav_link">
                                            <i className='bx bx-grid-alt nav_icon' />
                                            <span className="nav_name">
                                                {subTitle}
                                            </span>
                                        </a>
                                    </>
                                : 
                                <a onClick={() => handleClick(fullUrl)} id='subtitle' className="nav_link">
                                    <i className='bx bx-grid-alt nav_icon' />
                                    <span className="nav_name">
                                        {subTitle}
                                    </span>
                                </a>
                        )}
                        <a onClick={() => handleClick('/settings')} id='/settings' className="nav_link">
                            <i className='bx bx-user nav_icon' />
                            <span className="nav_name">
                                Settings
                            </span>
                        </a>
                    </div>
                </div>
                <a className="nav_link btn btn-info text-light mx-4" onClick={signOut}>
                    <span><FontAwesomeIcon icon={faRightFromBracket} /> Sign Out</span>
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