const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    password:{
        type:String
    },
}, {timestamps: true});

//Export the model
const Admin = mongoose.model('Admin', userSchema);
module.exports = Admin;