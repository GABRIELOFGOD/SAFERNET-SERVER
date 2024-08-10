const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var mediaSchema = new mongoose.Schema({
    title: String,
    link: String,
    description: String,
    cover: String,
    postedBy: String,
}, {timestamps: true});

//Export the model
const Media = mongoose.model('Media', mediaSchema);
module.exports = Media;