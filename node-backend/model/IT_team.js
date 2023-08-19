const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const resourceSchema = new Schema({
    resource: {
        type: String
    },
    name: [{ type: String }]
})

const itTeamSchema = new Schema({
    team_id: {
        type: Number,
        unique: true,
        required: true
    },
    resources: [resourceSchema],
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