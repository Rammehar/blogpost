const winston = require('winston');
const mongoose = require('mongoose');


module.exports = function(){
    mongoose.connect(process.env.DB_DETAIL,{
        useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex: true})
    .then(()=>winston.info(`connected to MongoDB ${process.env.DB_DETAIL}`));
     
    mongoose.set('useFindAndModify', false);
}


 
 