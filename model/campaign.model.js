// const mongoose = require('mongoose'); // Erase if already required

// // Declare the Schema of the Mongo model
// const campaignSchema = new mongoose.Schema({
//     title: String,
//     body: String,
//     image: String
// }, {timestamps: true});

// //Export the model
// const Campaign = mongoose.model('Campaign', campaignSchema);
// module.exports = Campaign


const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    location: String,
    body: String,
    images: [{
        type: String,
    }],
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Fellow',
    }
}, {timestamps: true});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;