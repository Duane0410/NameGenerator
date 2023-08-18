const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const array = new Schema({ type: String })

const nameSchema = new Schema({
    name: {
        type: String,
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