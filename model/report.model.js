const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const reportSchema = new mongoose.Schema({
    report: String,
    title: String,
    information: String,
    url: String,
    file: String
}, {timestamps: true});

//Export the model
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;