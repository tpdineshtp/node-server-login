var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// to store the user details
var userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    userID: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    userGroup: {
        type: Number
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);