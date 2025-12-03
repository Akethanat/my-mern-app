const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    job: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
});

const UserModel = require('mongoose').model("users", UserSchema);
module.exports = UserModel;