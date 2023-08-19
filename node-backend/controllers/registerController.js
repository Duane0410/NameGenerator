const User = require('../model/User');
const Team = require('../model/IT_team')
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, user, pass } = req.body;
    if (!name || !user || !pass) {
        return res.status(400).json({ "message": 'Name, username and password are required!' });
    }

    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409).json({ "message": 'Username already exists!'});
    }

    try {
        const hashedpass = await bcrypt.hash(pass, 10);
        
        const newUser = new User();
        newUser.name = name;
        newUser.username = user;
        newUser.password = hashedpass;

        const leader = await Team.findOne({ team_leader: name }).exec();
        if (leader) {
            newUser.roles.Leader = 4001;
        }

        const member = await Team.findOne({team_members: name}).exec();
        if (member) {
            newUser.roles.Member = 2001;
        }

        const result = await newUser.save();
        
        console.log(result);
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { handleNewUser };