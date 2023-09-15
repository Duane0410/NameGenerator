const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    roles: {
        Admin: Number,
        Leader: Number,
        Member: Number,
        User: {
            type: Number,
            default: 1001
        }
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    schedule_options: {
        weekly: {
            type: Boolean,
            default: true
        },
        monthly: {
            type: Boolean,
            default: true
        },
        quarterly:{
            type: Boolean,
            default: true
        },
        yearly: {
            type: Boolean,
            default: true
        },
        updated_only: {
            type: Boolean,
            default: false
        }
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema)