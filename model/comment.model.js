const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true,
    },
    // commentBy:{
    //     type: mongoose.Types.ObjectId,
    //     required:true,
    //     ref: "User"
    // },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    blogId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref: "Blog"
    }
}, {timestamps: true});

//Export the model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;