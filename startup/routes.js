const express = require('express');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const connectFlash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const homeRoute = require('../routes/home');
const postRoute = require('../routes/posts');
const contactRoute = require('../routes/contact');
const userRoute = require('../routes/users');
const chatRouter = require('../routes/chat');

module.exports = function(app){
    app.use(express.json());
    app.set('view engine', 'ejs');
    //app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.urlencoded({extended:false}));
    app.use(connectFlash());
    app.use(flash());
    app.use(session(
    {
        secret:'SayNoIfYouNotLike',
        saveUninitialized:false,
        resave:false
    }
    ));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req,res,next){
        res.locals.isLogged = req.isAuthenticated();
        next();
    });
    app.use('/', homeRoute );
    app.use('/post', postRoute );
    app.use('/contact', contactRoute );
    app.use('/user', userRoute );
    app.use('/chat',chatRouter);
 
}