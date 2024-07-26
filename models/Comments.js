const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'Users'},
    blogId : {type : mongoose.Schema.Types.ObjectId, ref : 'Blogs'},
    text : String
});


module.exports = mongoose.model('Comments', commentSchema);