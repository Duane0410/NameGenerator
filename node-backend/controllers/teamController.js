const IT_team = require('../model/IT_team');
const User = require('../model/User');

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

        const leader = await User.findOne({ name: req.body.team_leader }).exec();
        if (leader) {
            leader.roles.Leader = 4001;
            const result = leader.save();
            console.log(result);
        }

        req.body.team_members.map( async (person) => {
            const member = await User.findOne({ name: person }).exec();
            if (member) {
                member.roles.Member = 2001;
                const result = member.save();
                console.log(result);
            }
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
        const leader = await User.findOne({ name: Team.team_leader }).exec();
        if (leader) {
            leader.roles.Leader = null;
            const result = leader.save();
            console.log(result);
        }

        Team.team_leader = req.body.team_leader;

        const newLeader = await User.findOne({ name: req.body.team_leader }).exec();
        if (newLeader) {
            newLeader.roles.Leader = 4001;
            const result = newLeader.save();
            console.log(result);
        }
    }
    if (req.body?.team_members) {
        Team.team_members.map( async (person) => {
            const member = await User.findOne({ name: person }).exec();
            if (member) {
                member.roles.Member = null;
                const result = member.save();
                console.log(result);
            }
        })

        Team.team_members = req.body.team_members;

        req.body.team_members.map( async (person) => {
            const member = await User.findOne({ name: person }).exec();
            if (member) {
                member.roles.Member = 2001;
                const result = member.save();
                console.log(result);
            }
        })
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