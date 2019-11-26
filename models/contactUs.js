const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const contactSchema = new mongoose.Schema({
    email:{
        type:String,
        maxlength:100,
        required:"Please Enter email ID"
    },
    subject:{
        type:String,
        required:"Please Enter the Subject",
        
    },
    description:{
        type:String,
        required:"Please Enter Message"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
});

const ContactUs = mongoose.model('ContactUs',contactSchema);


function contactValidation(contact){
    const schema = {
        email: Joi.string().email().required(), 
        subject: Joi.string().required(),
        description: Joi.string().required() 
    };
    return Joi.validate(contact, schema);
}
module.exports.contactValidation = contactValidation;
module.exports.ContactUs= ContactUs;