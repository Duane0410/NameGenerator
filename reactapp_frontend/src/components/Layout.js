import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="d-flex justify-content-center vh-100 bg-primary App">
            <Outlet />
        </main>
    )
}

export default Layout