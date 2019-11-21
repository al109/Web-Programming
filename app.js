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
var PLAYER_LIST = {};

var Player = function(id){
  var self = {
    x:250,
    y:250,
    id:id,
    number:"" + Math.floor(10 * Math.random()),
    pressingRight:false,
    pressingLeft:false,
    pressingUp:false,
    pressingDown:false,
    rotation:0,
    maxSpd:10,
  }
  self.updatePosition = function(){
    if(self.pressingRight)
      self.x += self.maxSpd;
    if(self.pressingLeft)
      self.x -= self.maxSpd;
    if(self.pressingUp)
      self.y -= self.maxSpd;
    if(self.pressingDown)
      self.y += self.maxSpd;
  }
  return self;
}

io.sockets.on('connection',function(socket){
  console.log('made socket connection',socket.id)
  var player = Player(socket.id);
  SOCKET_LIST[socket.id] = socket;
  PLAYER_LIST[socket.id] = player;

  socket.on('start',function(data){

    console.log(data.name);
    console.log(socket.id);


    socket.on('disconnect',function(){
      delete SOCKET_LIST[socket.id];
      delete PLAYER_LIST[socket.id];
    });

    socket.on('keyPress',function(data){
      if(data.inputId === 'left')
        player.pressingLeft = data.state;
        player.rotation = data.rotation;
      if(data.inputId === 'right')
        player.pressingRight = data.state;
        player.rotation = data.rotation;
      if(data.inputId === 'up')
        player.pressingUp = data.state;
        player.rotation = data.rotation;
      if(data.inputId === 'down')
        player.pressingDown = data.state;
        player.rotation = data.rotation;
    });

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
  for(var i in PLAYER_LIST){
    var player = PLAYER_LIST[i];
    player.updatePosition();
    pack.push({
      x:player.x,
      y:player.y,
      rotation:player.rotation
    });
  }
  for(var i in SOCKET_LIST){
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions',pack);
  }

},1000/25);
