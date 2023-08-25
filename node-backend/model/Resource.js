const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    team_id: {
        type: Number,
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
    }
});

module.exports = mongoose.model('Resource', resourceSchema)