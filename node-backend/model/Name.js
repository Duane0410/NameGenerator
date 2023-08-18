const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nameSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: { 
        type: String,
        default: "available"
    },
    isValid: { 
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Name', nameSchema)