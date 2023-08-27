const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceTypeSchema = new Schema({
    type_id: {
        type: Number,
        unique: true,
        required: true
    },
    resource_type: {
        type: String,
        unique: true,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ResourceType', resourceTypeSchema)