import React, { useEffect, useState } from 'react';
import useLogout from '../hooks/useLogout';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import '../static/menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const currentUrl = location.pathname;

  const [hasSubtitle, setHasSubtitle] = useState(false);
  const [fullUrl, setFullUrl] = useState(window.location.href);
  const [subTitle, setSubTitle] = useState('');
  const [isHomeDropdownOpen, setIsHomeDropdownOpen] = useState(false);

  const homeDropdownItems = [
    { label: 'Option 1', path: '/option1' },
    { label: 'Option 2', path: '/option2' },
    // Add more submenu items for "Home" as needed
  ];

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
    setIsHomeDropdownOpen(false);
    // ... (unchanged)
  };

  const signOut = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    // ... (unchanged)
  }, [currentUrl]);

  const toggleHomeDropdown = () => {
    setIsHomeDropdownOpen(!isHomeDropdownOpen);
  };

  return (
    <div className='App nav-space'>
      <div class="l-navbar" id="nav-bar">
        <nav class="nav">
          <div>
            <div class="nav_logo">
              <i class='bx bx-layer nav_logo-icon' /> 
              <span class="nav_logo-name">
               InfraNameGen
              </span>
            </div>
            <div class="nav_list">
              <div className="nav_item">
              <a onClick={() => handleClick('/')} id='/' className="nav_link">
                <i className='bx bx-user nav_icon' />
                <span className="nav_name">
                  Home
                </span>
              </a>
                <div className="nav_link" onClick={toggleHomeDropdown}>
                  <i className={`bx bx-grid-alt nav_icon ${isHomeDropdownOpen ? 'rotate-icon' : ''}`} />
                  <span className="nav_name">
                   Resources
                  </span>
                </div>
                {isHomeDropdownOpen && (
                  <div className="submenu">
                    {homeDropdownItems.map((item, index) => (
                      <a key={index} onClick={() => handleClick(item.path)} className="nav_link">
                        <i className='bx bx-user nav_icon' />
                        <span className="nav_name">
                          {item.label}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {hasSubtitle && (
                subTitle === 'Update' ? (
                  <a href={fullUrl} id='subtitle' className="nav_link">
                    <i className='bx bx-grid-alt nav_icon' />
                    <span className="nav_name">
                      {subTitle}
                    </span>
                  </a>
                ) : (
                  <a onClick={() => handleClick(fullUrl)} id='subtitle' className="nav_link">
                    <i className='bx bx-grid-alt nav_icon' />
                    <span className="nav_name">
                      {subTitle}
                    </span>
                  </a>
                )
              )}
              <a onClick={() => handleClick('/set-schedule')} id='/set-schedule' className="nav_link">
                <i className='bx bx-user nav_icon' />
                <span className="nav_name">
                  Email Schedule 
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
  );
};

export default Menu;
