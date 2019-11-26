const winston = require('winston');
const express = require('express');
const app = express();
const http = module.exports = require('http').createServer(app);

app.locals.myExcerpt = require('./helpers/excerpt');
app.locals.checkObjEmpty = require('./helpers/checkObjectEmpty');
app.locals.auth = require('./helpers/authenticate');
 
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();


const port = process.env.PORT || 3000;
http.listen(port,()=>{
    winston.info(`Server Listening on port ${port}...`);
});