import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth()

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        })
        console.log('RefAuth - ', auth)
        setAuth(prev => {
            console.log('RData - ', JSON.stringify(prev))
            console.log('RResponse - ', response.data)
            return { 
                ...prev,
                user: response.data.user,
                roles: response.data.roles,
                teamID: response.data.teamID,
                accessToken: response.data.accessToken
            }
        })
        return response.data.accessToken
    }
  return refresh
}

export default useRefreshToken