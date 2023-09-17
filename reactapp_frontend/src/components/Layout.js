import { Outlet } from "react-router-dom";
import React from 'react';
import '../static/layout.css'; // Import your layout.css file

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