const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const campaignSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String
}, {timestamps: true});

//Export the model
const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign