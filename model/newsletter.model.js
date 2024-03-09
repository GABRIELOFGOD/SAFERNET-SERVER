const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const newsletterSchema = new mongoose.Schema({
    email: String
}, {timestamps: true});

//Export the model
const Newsletter = mongoose.model('Newsletter', newsletterSchema);
module.exports = Newsletter;