import { Outlet } from "react-router-dom";
import React from 'react';
import '../static/layout.css';

const Layout = () => {
  return (
    <div>
        <div className="container">
            <Outlet />
        </div>
    </div>
  );
}

export default Layout;