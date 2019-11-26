const express = require('express');
const router = express.Router();
 
const { User, validateUserRegistration, validateProfile } = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('../models/passportConfig');
 initializePassport(
        passport,
        email => {
        return  User.findOne({ email : email}).exec(); 
        },
        id => {
            return User.findById(id).exec();
        }
 );
const auth = require('../helpers/authenticate');
//show the registration page
router.get('/register', auth.checkNotAuthenticated, (req, res) =>{
    res.render('register',{msg:req.flash('info')});
}); 

//submit registration form
router.post('/register', auth.checkNotAuthenticated, validateUserRegistration,
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('info', errors.array());
        res.redirect('/user/register');
        return;
    }
    const salt = await bcrypt.genSalt(10);
    encryptPassword = await bcrypt.hash(req.body.password, salt);
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: encryptPassword
    }); 
    user = await user.save();
    req.flash('info','User Registeration Successful You can log in now!');
    res.redirect('/user/login');
});




//show the login form
router.get('/login', auth.checkNotAuthenticated, (req, res) =>{
    res.render('login',{msg:req.flash('info')});
});
//get the value from login form and validate user
router.post('/login', auth.checkNotAuthenticated, passport.authenticate('local',
    {
        successRedirect:'/',
        failureRedirect: '/user/login',
        badRequestMessage: 'Both Field are required!.', 
        failureFlash: true
    } 
)); 
//get user profile details
router.get('/profile', auth.checkAuthenticated, (req, res) =>{
    res.render('profile',{user:req.user, msg:req.flash('info')});
});
//update user profile
router.post('/update', auth.checkAuthenticated, validateProfile, async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash('info', errors.array());
        res.redirect('/user/profile');
        return;
    }
    const salt = await bcrypt.genSalt(10);
    encryptPassword = await bcrypt.hash(req.body.password, salt);
    try{
        await User.findOneAndUpdate({_id:req.user._id}, {$set:{
            name:req.body.name,
            password:encryptPassword
        }}, {new: true}).exec();
    }catch(error){
        console.log(error);
        req.flash('info',error);
    }
    req.flash('info','Profile Updated Successfully !');
    res.redirect('/user/profile');
});

router.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/user/login');
});


module.exports =router;
