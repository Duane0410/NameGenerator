const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const IT_team = require('../model/IT_team');

const handleLogin = async (req, res) => {
    const { user, pass } = req.body;
    if (!user || !pass) {
        return res.status(400).json({ "message": 'Username and password are required.' });
    }

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(pass, foundUser.password);
    const foundNameLeader = await IT_team.findOne({ team_leader: foundUser.name }).exec()
    const foundNameMember = await IT_team.findOne({ team_members: foundUser.name }).exec()
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        let teamID = 0;

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result)

        if (foundNameLeader) {
            teamID = foundNameLeader.team_id;
        }
        if (foundNameMember) {
            teamID = foundNameMember.team_id;
        }
        
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken, roles, teamID });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };