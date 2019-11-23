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

serv.listen(2000,'10.0.1.17');
console.log("Server started");

var io = require('socket.io')(serv,{});
var SOCKET_LIST = {};
var PLAYER_LIST = {};


var Player = function(id,rotation){
  var self = {
    x:250,
    y:250,
    id:id,
    number:"" + Math.floor(10 * Math.random()),
    pressingRight:false,
    pressingLeft:false,
    pressingUp:false,
    pressingDown:false,
    rotation:rotation,
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



var bullet = function(angle){
  var self = Entity();
  self.id = Math.random();
  self.velocityX = Math.cos(angle/180*Math.PI) * 10;
  self.velocityY = Math.sin(angle/180*Math.PI) * 10;
  self.timer = 0;
  self.toRemove = false;
  var super_update = self.update;
  self.update = function(){
    if(self.timer++ > 100){
      self.toRemove = true;
    }
    super_update();
  }
  bulletComponent.list[self.id] = self;
  return self;
  
  
}
bullet.list = {};

bullet.update = function(){
  var pack = [];
  for(var i in bullet.list){
    var bullet = bullet.list[i]
    bullet.update();
    pack.push({
      x: bullet.x,
      y:bullet.y
    })
  }
}

io.sockets.on('connection',function(socket){
  console.log('made socket connection',socket.id)

  socket.on('start',function(data){
    var player = Player(socket.id,0);
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST[socket.id] = player;
    console.log(data.name);
    console.log(socket.id);


    socket.on('disconnect',function(){
      delete SOCKET_LIST[socket.id];
      delete PLAYER_LIST[socket.id];
      delete playerBullets[socket.id];
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
      if(data.inputId === 'space'){
        playerBullets[socket.id] += new Bullet(player.rotation, player.x,player.y)
      }

  });



  socket.on('username',function(data){
    con.connect(function() {
    var sql = 'INSERT INTO Users (username) VALUES ?';
    var values = [[data.name]];
    console.log(data.name);
    con.query(sql,[values],function(err){
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
    var bullets = playerBullets[i];
    player.updatePosition();
    pack.push({
      x:player.x,
      y:player.y,
      rotation:player.rotation,
     });
    
  }
  for(var i in SOCKET_LIST){
    var socket = SOCKET_LIST[i];
    socket.emit('newPositions',pack);
  }
},1000/25);})
