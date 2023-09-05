const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceTypeSchema = new Schema({
    resource_type: {
        type: String,
        unique: true,
        required: true
    },
    name_categories: {
        type: [{ 
            type: String,
            unique:true 
        }],
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ResourceType', resourceTypeSchema)