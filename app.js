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

var Entity = function(){
    var self = {
        x:150,
        y:150,
        spdX:0,
        spdY:0,
        id:"",
    }
    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){

        self.x += self.spdX;
        self.y += self.spdY;
    }
    self.getDistance = function(pt){
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    }
    return self;
}

var Player = function(id,rotation,ship,username){
    var self = Entity();
    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingSpace = false;
    self.pressingAttack = false;
    self.score = 0;
    self.limit = 0;
    self.mouseAngle = 0;
    self.maxSpd = 10;
    self.rotation = rotation;
    self.ship = ship;
    self.username = username;
    var super_update = self.update;
    self.update = function(){
        self.updateSpd();
        super_update();

        if(self.pressingAttack){
            self.shootBullet(self.rotation-90);
        }
    }
    self.shootBullet = function(angle){
        var b = Bullet(self.id,angle);
        b.x = self.x;
        b.y = self.y;
    }

    //
    self.updateSpd = function(){
        if(self.pressingRight){
            if(self.x < self.limit){
                self.spdX = self.maxSpd;
            }
            else{
                self.spdX = 0;
            }
        }
        else if(self.pressingLeft)
        if(self.x > self.limit){
            self.spdX = -self.maxSpd;
        }
        else{
            self.spdX = 0;
        }
        else
            self.spdX = 0;

        if(self.pressingDown){

            if(self.y < self.limit  -40){
                self.spdY = self.maxSpd;
                }
            else{
                self.spdY = 0;
            }
            }
        else if(self.pressingUp)
            if(self.y > self.limit){
                self.spdY = -self.maxSpd;
             }
            else{
             self.spdY = 0;
            }


        else{

            self.spdY = 0;

        }
    }
    Player.list[id] = self;
    return self;
}
Player.list = {};
Player.onConnect = function(socket){
    var player = Player(socket.id,0,SHIP_ID[SHIP_ID.length-1],USERNAME_LIST[USERNAME_LIST.length-1]);
    socket.on('keyPress',function(data){

        if(data.inputId === 'left')
            player.pressingLeft = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;
}
        if(data.inputId === 'right')
            player.pressingRight = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;

  }

        if(data.inputId === 'up')
            player.pressingUp = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;


}

        if(data.inputId === 'down')
            player.pressingDown = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;

}

        if(data.inputId === 'attack')
            player.pressingAttack = data.state;
            console.log(data.limit);
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;

          }
    });
}
Player.onDisconnect = function(socket){
    delete Player.list[socket];
}
Player.update = function(){
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push({
            x:player.x,
            y:player.y,
            number:player.number,
            rotation:player.rotation,
            score:player.score,
            ship:player.ship,
            username:player.username
        });
    }
    return pack;
}

//This is the bullet.
var Bullet = function(parent,angle){
    var self = Entity();
    self.id = Math.random();
    self.spdX = Math.cos(angle/180*Math.PI) * 20;//This calculates the velocity of the bullets x axis.
    self.spdY = Math.sin(angle/180*Math.PI) * 20;//This calculates the velocity of the bullets y axis.
    self.parent = parent;
    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function(){
        if(self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for(var i in Player.list){
            var p = Player.list[i];
            //If a player gets hit, thats not the player that shot the bullet
            if(self.getDistance(p) < 25 && self.parent !== p.id){
                //These respawn the player after its been hit by a ship
                p.x = 150;
                p.y = 150;
                //Adds 1 on to the score of the player that shot the bullet
                Player.list[self.parent].score ++;
                console.log(Player.list[self.parent].score + " " + self.parent);
                //handle collision. ex: hp--;
                self.toRemove = true;
            }

        }
    }
    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};

Bullet.update = function(){
    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove)
            delete Bullet.list[i];
        else
            pack.push({
                x:bullet.x,
                y:bullet.y,
            });
    }
    return pack;
}

var USERNAME_LIST = [];
var SHIP_ID = [];
var PLACE = [];
var i = 0;

io.sockets.on('connection', function(socket){
    socket.on('username',function(data){
      USERNAME_LIST.push(data.name);
    });

    socket.on('shipID',function(data){
      SHIP_ID.push(data.id);
    });

    socket.on('start',function(data){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    Player.onConnect(socket);
    PLACE[socket.id] = i;
    i++;
    socket.emit('place',{
      place:PLACE[socket.id]
    });
    var sql = "INSERT INTO Users (username,shiptype) VALUES ?"
    var values = [
      [USERNAME_LIST[USERNAME_LIST.length-1],SHIP_ID[SHIP_ID.length-1]]
    ];
    con.query(sql,[values],function(err,result){
      if (err) throw err;
      console.log("Number of records inserted" + result.affectedRows);
    });
    socket.emit('ship',{

      shipID:SHIP_ID[SHIP_ID.length-1]
    });
  });

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket.id);

});
});

setInterval(function(){
    var pack = {
        player:Player.update(),
        bullet:Bullet.update(),
    }

    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions',pack);
    }
},1000/25);
