const mongoose = require('mongoose');

var fellowSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
    },
    fellowId: {
      type: String,
      unique: true
    },
    image: {
        type: String
    },
    campaigns: [{
        type: mongoose.Types.ObjectId,
        ref: 'Campaign',
        default: []
    }],
}, {timestamps: true});

const GenFellowSchema = new mongoose.Schema({
  email: String,
  fellowId: String
}, {timestamps: true})

//Export the model
const Fellow = mongoose.model('Fellow', fellowSchema);
const GenFellow = mongoose.model('GenFellow', GenFellowSchema);

module.exports = { Fellow, GenFellow }