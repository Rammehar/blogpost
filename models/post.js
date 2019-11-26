const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Schema = mongoose.Schema;
const replySchema = new Schema({
    name: String,
    reply: String
});
const commentSchema = new Schema({
    username: String,
    email: String,
    comment: String,
    replies: [replySchema]
});
const postSchema = new Schema({
    title: {
        type:String,
        required: true 
    },
    description: String,
    author:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    date:{
        type:Date,
        default:Date.now
    },
    comments: [commentSchema]
});
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports.Post = Post;
module.exports.Comment = Comment;
module.exports.Reply = Reply;


