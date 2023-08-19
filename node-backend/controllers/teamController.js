const IT_team = require('../model/IT_team');

const getAllTeams = async (req, res) => {
    const Teams = await IT_team.find();
    if (!Teams) {
        return res.status(204).json({ "message": 'No IT_teams found!' });
    }
    res.json(Teams);
}

const createNewTeam = async (req, res) => {
    if (!req?.body?.team_id || !req.body?.team_leader || !req.body?.team_members) {
        return res.status(400).json({ "message": 'IT team ID, leader name and member names are required!' });
    }

    const exists = await IT_team.findOne({ team_id: req.body.team_id }).exec();
    if (exists) {
        return res.status(409).json({ "message": `IT team with ID ${req.body.team_id} already exists!` });
    }

    try {
        const result = await IT_team.create({
            team_id: req.body.team_id,
            team_leader: req.body.team_leader,
            team_members: req.body.team_members
        })

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
    }
}

const updateTeam = async (req, res) => {
    if (!req?.body?.team_id) {
        return res.status(400).json({ "message": 'Team ID is required!' });
    }

    const Team = await IT_team.findOne({ team_id: req.body.team_id }).exec();

    if (!Team) {
        return res.status(204).json({ "message": `No team matches ID ${req.body.team_id}.` });
    }

    if (req.body?.team_leader) {
        Team.team_leader = req.body.team_leader;
    }
    if (req.body?.team_members) {
        Team.team_members = req.body.team_members;
    }
    if (req.body?.resources) {
        if (req.body.resources?.resource) {
            Team.resources.resource = req.body.resources.resource;
        }
        if (req.body.resources?.name) {
            Team.resources.name = req.body.resources.name;
        }
    }
    const result = await Team.save();
    res.json(result);
}

const deleteTeam = async (req, res) => {
    if (!req?.body?.team_id) {
        return res.status(400).json({ "message": 'IT team ID require!' })
    }

    const Team = await IT_team.findOne({ team_id: req.body.team_id }).exec()

    if (!Team) {
        return res.status(204).json({ "message": `No IT team matches ID ${req.body.team_id}.` });
    }
    const result = await IT_team.deleteOne({ team_id: req.body.team_id });
    res.json(result);
}

const getTeam = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'IT team ID require!' })
    }

    const Team = await IT_team.findOne({ team_id: req.params.id }).exec()
    if (!Team) {
        return res.status(204).json({ "message": `No IT team matches ID ${req.params.id}.` });
    }
    res.json(Team);
}

module.exports = {
    getAllTeams,
    createNewTeam,
    updateTeam,
    deleteTeam,
    getTeam
}