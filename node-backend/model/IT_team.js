const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itTeamSchema = new Schema({
    resources: {
        resource: { type: String },
        name: [{ type: String }],
        required: true
    },
    team_leader: {
        type: String,
        required: true
    },
    team_members: {
        name: [array]
    }
});

module.exports = mongoose.model('IT_team', itTeamSchema)