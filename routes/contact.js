const express = require('express');
const router = express.Router();
require('dotenv').config();
const sendMail = require('../helpers/sendmail');
const {contactValidation, ContactUs} = require('../models/contactUs');

//show to the contact page
router.get('/', (req, res) => {
    res.render('contact',{ msg: req.flash('info'),contact:'' });
});

//send mail
router.post('/send_mail', async (req, res) => {
    try{
        let contact = new ContactUs({
            email:req.body.email,
            subject:req.body.subject,
            description:req.body.description
        }); 
        contact = await contact.save();
        let sub  = req.body.subject; 
        let message = req.body.message;   
        sendMail(sub, message).catch(console.error);
        req.flash('info', 'Mail send successfully!')
        res.redirect('/contact');
    }
    catch(error){

        if(error.name =='ValidationError'){
            handleValidationErrors(error, req.body);
            res.render('contact',{ msg: '',contact: req.body});
        }
    }
});
function handleValidationErrors(err, body){
    for(field in err.errors)
    {
        switch(err.errors[field].path)
        {
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'subject':
                body['subjectError'] = err.errors[field].message;
                break;
            case 'description':
                body['descriptionError'] = err.errors[field].message;
                break;
            default:
                 break;
        }
    }
}

module.exports = router;