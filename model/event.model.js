const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const eventSchema = new mongoose.Schema({
    title: String,
    about: String,
    date: Date,
    time: String,
    venue: String,
    image: String
}, {timeseries: true});

//Export the model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;