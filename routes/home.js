const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Post} = require('../models/post');
//const auth = require('../helpers/authenticate');

router.get('/',  async (req, res) =>{
      //const total_posts = await Post.count({});
      //let random = Math.floor(Math.random() * total_posts);
      const posts = await Post.find()
                              .limit(6)
                              .populate('author')
                              .sort({date: -1});
      const latestPost = await Post
                              .findOne()
                              .populate('author')
                              .sort({date: -1});
      res.render('home',{posts, latestPost});
});
module.exports = router;