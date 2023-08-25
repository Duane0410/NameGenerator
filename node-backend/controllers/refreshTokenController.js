const IT_team = require('../model/IT_team');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        return res.sendStatus(403);
    } 
    const foundNameLeader = await IT_team.findOne({ team_leader: foundUser.name }).exec()
    const foundNameMember = await IT_team.findOne({ team_members: foundUser.name }).exec()
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decoded) => {
            if (error || foundUser.username !== decoded.username) {
                return res.sendStatus(403);
            }
            const roles = Object.values(foundUser.roles).filter(Boolean)
            let teamID = 0;
            const user = foundUser.username
            if (foundNameLeader) {
                teamID = foundNameLeader.team_id;
            }
            if (foundNameMember) {
                teamID = foundNameMember.team_id;
            }
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10min' }
            );
            console.log('User - ', user, '\nRoles - ', roles, '\nTeamID - ', teamID, '\nAccessToken - ', accessToken)
            res.json({ user, roles, teamID, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }