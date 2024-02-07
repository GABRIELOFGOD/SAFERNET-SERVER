const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    image: {
        type: String
    },
    postedBy: String,
    posterId: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin'
    }

});

//Export the model
const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;