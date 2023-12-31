import React, { useEffect, useState } from 'react';
import useLogout from '../hooks/useLogout';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../static/menu.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logout = useLogout();
    const currentUrl = location.pathname;
    const fullUrl = window.location.href;
    const axiosPrivate = useAxiosPrivate();

    const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false)
    const [data, setData] = useState()
    const [homeDropdownItems, setHomeDropdownItems] = useState([
        { label: 'Option 1', path: '/teams' },
        { label: 'Option 2', path: '/team-controll' }
    ])

    const safePages = ['/', '/set-schedule']

    const handleClick = (address) => {
        if (safePages.includes(currentUrl) || safePages.includes(address)) {
            setIsHomeDropdownOpen(false);
            navigate(`${address}`);
            return
        }
        navigate(`${address}`);
        window.location.reload()
    };

    const getQueryParameter = (url, parameterName) => {
        const queryParams = new URLSearchParams(new URL(url).search);
        return queryParams.get(parameterName);
    };

    const signOut = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getData = async () => {
            try {
                const response = await axiosPrivate.get(`/resource-types`, {
                    signal: controller.signal,
                });
                isMounted && setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const arrayDrop = [];
        if (data) {
            data.forEach((item) => {
                arrayDrop.push({ label: `${item.resource_type}`, path: `/resources?resource=${encodeURIComponent(item.resource_type)}&categories=${encodeURIComponent(item.name_categories)}` });
                if (getQueryParameter(fullUrl, 'resource') === item.resource_type) setIsHomeDropdownOpen(true);
            });
            setHomeDropdownItems(arrayDrop);
        }
    }, [data]);

    useEffect(() => {
        const linkColor = document.querySelectorAll('.nav_link');

        const removeColor = () => {
            if (linkColor) {
                linkColor.forEach((e) => e.classList.remove('active'));
            }
        };

        removeColor();

        if (currentUrl) {
            const putColor = document.getElementById(currentUrl);
            if (putColor?.classList) putColor.classList.add('active');
        }

        if (['/resources', '/create', '/update'].includes(currentUrl)) {
            document.getElementById('resource').classList.add('text-white')
            setIsHomeDropdownOpen(true)
        } else {
            document.getElementById('resource').classList.remove('text-white')
        }
    }, [currentUrl]);

    const toggleHomeDropdown = () => {
        setIsHomeDropdownOpen(!isHomeDropdownOpen);
    };

    return (
        <div className='App nav-space'>
            <div className="l-navbar" id="nav-bar">
                <nav className="nav">
                    <div>
                        <a onClick={() => handleClick('/')} className="nav_logo nav_link">
                            <i className='bx bx-layer nav_logo-icon' /> 
                            <span className="nav_logo-name">
                                Infrastructure Resource Name Generator
                            </span>
                        </a>

                        <div className="nav_list">
                            <div className="nav_link" onClick={toggleHomeDropdown}>
                                <i className={`bx bx-grid-alt nav_icon ${isHomeDropdownOpen ? 'rotate-icon' : ''}`} />
                                <span id='resource' className='nav_name'>
                                    Resources {!isHomeDropdownOpen ? <FontAwesomeIcon icon={faChevronDown} />: <FontAwesomeIcon icon={faChevronUp} />}
                                </span>
                            </div>

                            {isHomeDropdownOpen && (
                                <div className="submenu">
                                    {homeDropdownItems.map((item, index) => (
                                        <a
                                            key={index}
                                            onClick={() => handleClick(item.path)}
                                            className={`nav_link ${(item.path === currentUrl || getQueryParameter(fullUrl, 'resource') === item.label) ? 'active' : ''}`}
                                        >
                                            <span className="nav_name px-4">
                                                {item.label}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a onClick={() => handleClick('/set-schedule')} id='/set-schedule' className="nav_link">
                            <i className='bx bx-user nav_icon' />
                            <span className="nav_name">
                                Email Schedule 
                            </span>
                        </a>
                    </div>
                    <a className="nav_link btn btn-danger text-light mx-4 w-75" onClick={signOut}>
                        <span><FontAwesomeIcon icon={faRightFromBracket} /> Sign Out</span>
                    </a>
                </nav>
            </div>

            <div className='content'>
                <Outlet />
            </div>
        </div>
    );
};

export default Menu;