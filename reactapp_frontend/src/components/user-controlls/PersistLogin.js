import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from "../../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const { auth } = useAuth()

    useEffect(() => {
        let isMounted = true

        const verifyRefreshToken = async () => {
            try {
                await refresh()
            } catch (error) {
                console.error(error)
            } finally {
                isMounted && setIsLoading(false)
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

        return () => isMounted = false
    }, [])

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
    }, [isLoading])

    return (
        <>
            {
                isLoading
                    ? <h1 className="text-center text-light mt-5"><b>Loading...</b></h1>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin