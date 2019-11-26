const express = require('express');
const router = express.Router();

const http = require('../index');
const io = require('socket.io')(http);

 

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

router.get('/', (req, res) =>{
  res.render('chat');
});


module.exports = router;