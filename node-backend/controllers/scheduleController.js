const User = require('../model/User');

const getScheduleOptions = async (req, res) => {
    const { user } = req.body
    const users = await User.findOne({ username: user }).exec();
    if (!users) {
        return res.status(204).json({ "message": 'No resources found!' });
    }
    res.json(users.schedule_options);
}

const updateScheduleOptions = async (req, res) => {
    const {user, weekly, monthly, quarterly, yearly, updated_only} = req.body
    
    if (!user) {
        return res.status(400).json({ "message": 'Username is required!' });
    }

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) {
        return res.status(204).json({ "message": `No username ${user}.` });
    }
    console.log('Found User - ', foundUser)

    foundUser.weekly = weekly
    foundUser.monthly = monthly
    foundUser.quarterly = quarterly
    foundUser.yearly = yearly
    foundUser.updated_only = updated_only

    const result = await foundUser.save();
    console.log('Result - ', result)
    res.status(201).json({ 'success': `User ${user} schedule updated!` });
}

module.exports = { 
    updateScheduleOptions,
    getScheduleOptions 
};