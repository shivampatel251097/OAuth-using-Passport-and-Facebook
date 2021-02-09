const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Passport local mongoose- this bydefault create schema with USER(having fields username, password)
var passportLocalMongoose = require('passport-local-mongoose');
//User schema to be stored in mongoDB
var User =  new Schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',User);