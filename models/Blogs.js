const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    userid : {type : mongoose.Schema.Types.ObjectId, ref:'User'},
    author:String,
    title:String,
    body : String,
    dateCreated : Date,
    picture : String,
    commentId : [{type : mongoose.Schema.Types.ObjectId, ref : 'Comments'}],
    likes_count : Number,
  //  likedUsers : [{type:mongoose.Schema.Types.ObjectId, ref : 'User'}]

});


module.exports = mongoose.model('Blogs', blogSchema);