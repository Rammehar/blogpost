const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Post,Comment, Reply} = require('../models/post');
const auth = require('../helpers/authenticate');

//get with limit for pagination
router.get('/', async (req, res) => {
  const perPage = 3;
  let page = req.params.page || 1;
  const posts = await Post.find({})
                          .populate('author')
                          .skip((perPage * page)
                            - perPage)
                          .limit(perPage);
  let count = await Post.countDocuments({});
  res.render('posts',{posts:posts,current:page,count:count, pages: Math.ceil(count / perPage)});
});
//get with limit for pagination
router.get('/:page', async (req, res) => {
  const perPage = 3;
  let page = req.params.page || 1;
  const posts = await Post.find({})
                          .populate('author')
                          .skip((perPage * page)
                            - perPage)
                          .limit(perPage);
  let count = await Post.countDocuments({});
  res.render('posts',{posts:posts,current:page,count:count, pages: Math.ceil(count / perPage)});
});

//get single post 
router.get('/detail/:postId', async (req, res) => {
  try{
    const  post  = await Post
    .findById(req.params.postId)
    .populate('author');
    
    if(!post) return res.status(400).send('There is no post for this ID you are lookking for');
    res.render('single_post', {post});
  }catch(err){
    console.log(err.message);
  }
});

//get form to add new post
router.get('/add/new', auth.checkAuthenticated, (req, res) => {
  res.render('addPost',{msg:req.flash('info')});
});
//submit a post to database
router.post('/add/new', auth.checkAuthenticated, async (req, res) =>{
    
      let post = new Post({ 
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        author: req.user._id
      });
      
      post = await post.save();
      req.flash('info','Successfully Added');
      res.redirect('/post/add/new');
    });

router.post('/do-comment', async (req, res) =>{
  const post = await Post.findById(req.body.post_id);
  const comment = new Comment({
    username:req.body.name,
    email: req.body.email,
    comment: req.body.comment
  });
   post.comments.push(comment);
   await post.save();
  res.redirect('/post/detail/'+req.body.post_id);

 });
//reply to comment
router.post('/do-reply', async (req, res) =>{
  const post = await Post.findById(req.body.post_id);
  //const comment = await post.comments.findById(req.body.comment_id);
  const comment = post.comments.id(req.body.comment_id);

  const reply = new Reply({
     name:req.body.name,
     reply: req.body.reply
  }); 
  comment.replies.push(reply);
   await post.save();
  res.redirect('/post/detail/'+req.body.post_id);

 });


//delete a post
router.delete('/:postId', async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.postId.trim())
  if(!post) return res.status(400).send('Requested Url Not Found!');
  res.send(post);
});

//update a post
router.put('/:postId', async (req, res) => {
  let post = await Post.findByIdAndUpdate(req.params.postId.trim(),{
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    author: req.body.author.trim()
  },{new:true});

  if(!post) return res.status(400).send('The given Id not found');
  res.send(post);
});

module.exports = router;