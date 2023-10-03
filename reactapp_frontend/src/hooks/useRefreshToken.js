import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth()

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        })
        
        setAuth(prev => {
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