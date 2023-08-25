const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itTeamSchema = new Schema({
    team_id: {
        type: Number,
        unique: true,
        required: true
    },
    team_leader: {
        type: String,
        required: true
    },
    team_members: {
        type: [{ type: String }],
        required: true
    }
});

module.exports = mongoose.model('IT_team', itTeamSchema)