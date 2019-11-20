var express = require('express')
var app = express();
var serv = require('http').Server(app);
var socket = require('socket.io')

app.get('/' ,function(req,res) {
  res.sendFile(__dirname + '/index.html');

});
app.use('/',express.static(__dirname + '/'));
app.use('/Javascript',express.static(__dirname + '/Javascript'));
app.use('/Style',express.static(__dirname + '/Style'));

serv.listen(2000);
console.log("Server started");

var io = socket(serv);

io.on('connection',function(socket){
  console.log('made socket connection',socket.id)
});
