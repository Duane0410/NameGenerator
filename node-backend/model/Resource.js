const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    team_id: {
        type: Number,
        required: true
    },
    date_created: {
        type: String,
        required: true
    },
    date_updated: {
        type: String
    },
    assigned_by: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Resource', resourceSchema)