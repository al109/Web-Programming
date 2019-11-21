var express = require('express')
var app = express();
var serv = require('http').Server(app);

let mysql = require('mysql');

let con = mysql.createConnection({
    host: 'sql2.freesqldatabase.com',
    user: 'sql2312807',
    password: 'yB7%iC5*',
    database: 'sql2312807'
});


app.get('/' ,function(req,res) {
  res.sendFile(__dirname + '/index.html');

});
app.use('/',express.static(__dirname + '/'));
app.use('/Javascript',express.static(__dirname + '/Javascript'));
app.use('/Style',express.static(__dirname + '/Style'));

serv.listen(2000);
console.log("Server started");

var io = require('socket.io')(serv,{});
var SOCKET_LIST = {};

io.sockets.on('connection',function(socket){
  console.log('made socket connection',socket.id)
  socket.on('start',function(data){
    socket.x = 0;
    socket.y = 0;
    SOCKET_LIST[socket.id] = socket;
    console.log(data.name);
    console.log(socket.id);
  });
  socket.on('username',function(data){
    con.connect(function(err) {
    var sql = 'INSERT INTO Users (username) VALUES ?';
    var values = [[data.name]];
    console.log(data.name);
    con.query(sql,[values],function(err,result){
      if (err) throw err;
      console.log("IT WORKED REEEEE")
    });
  });
  });
});

setInterval(function(){
  var pack = [];
  for(var i in SOCKET_LIST){
    var socket = SOCKET_LIST[i];
    socket.x++;
    socket.y++;
    pack.push({
      x:socket.x,
      y:socket.y
    });
  }
  for(var i in SOCKET_LIST){
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions',pack);
  }

},1000/25);
