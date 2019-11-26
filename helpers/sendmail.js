const nodemailer = require('nodemailer');

async function sendmail(subject, body) {
    let transporter = nodemailer.createTransport({
         service: 'gmail', 
         auth: {
             user: process.env.EMAIL,
             pass:  process.env.PASSWORD 
         }
     });
     let mailOptions = {
         from:'nodejstesting@gmail.com',
         to: 'rammehar1981@gmail.com',
         subject:subject,
         text:body
     }
     let info = await transporter.sendMail(mailOptions);
     console.log(info);
 }
 module.exports = sendmail;