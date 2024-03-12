const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const abuseSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:String,
    age:String,
    gender:String,
    abuse:String,
    evidence:String,
    evidenceType:String,
    actionTaken: String,
    actionWant:String,
    caseId:String,
    caseCode:String,
    caseStatus: String,
    reportMeans:String
}, {timestamps:true});

//Export the model
const Abuse = mongoose.model('Abuse', abuseSchema);

module.exports = Abuse;