const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    avatar: {
        type: String
    },
    status: {
        type: String,
        default: 'online'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    incognitoMode: { 
        type: Boolean, 
        default: false 
    },
    gamification: {
        points: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        achievements: [String]
    },
    selfDestructTimer: { 
        type: Number, 
        default: 0
    } ,
     // fields for friend system:
    friendRequests: {
        incoming: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        outgoing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);