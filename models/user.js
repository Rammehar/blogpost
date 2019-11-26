const mongoose = require('mongoose');
const { check } = require('express-validator');

userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:"Name is required",
        maxlength:100
    },
    email:{
        type:String,
        required:"Email is required",
    },
    password:{
        type:String,
        required:"password is required"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

// userSchema.methods.findByEmail  = function (cb) {
//     return this.model('User').find({ email: this.email }, cb);
// }
const User = mongoose.model('User',userSchema);

const validateUserRegistration = [
    check('name','Please Enter the Name').not().isEmpty(),
    //check('email','Please Enter Email').isEmail(),
    check('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email')
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        User.findOne({email:req.body.email}, function(err, user){
          if(err) {
            reject(new Error('Server Error'))
          }
          if(Boolean(user)) {
            reject(new Error('E-mail already in use'))
          }
          resolve(true)
        });
      });
    }),
    check("password", "Please enter password")
    .custom((value,{req}) => {
        if (value !== req.body.confirm_password) {
            // throw error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })

];



//validate profile update of user
const validateProfile = [
  check('name','Please Enter the Name').not().isEmpty(),
  check("password", "Please enter password")
  .custom((value,{req}) => {
      if (value !== req.body.confirm_password) {
          // throw error if passwords do not match
          throw new Error("Passwords don't match");
      } else {
          return value;
      }
  })

];

module.exports.User = User;
module.exports.validateUserRegistration = validateUserRegistration;
module.exports.validateProfile = validateProfile;
 