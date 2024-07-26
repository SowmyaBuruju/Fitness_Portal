const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName:String,
    email:String,
    gender : String,
    age : Number,
    password : String,
    blogsId : [{type : mongoose.Schema.Types.ObjectId, ref : 'Blogs'}],
    commentsId : [{type : mongoose.Schema.Types.ObjectId, ref : 'Comments'}]
});


module.exports = mongoose.model('Users', userSchema);