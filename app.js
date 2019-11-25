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
serv.maxConnections = 11;
console.log("Server started");

var io = require('socket.io')(serv,{});
var listOfSockets = {};

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
        self.updateSpd(); //this is calling the update function contained within the player function
        super_update(); //this calls the update function contained in the Entity function

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

var USERNAME_LIST = []; //this creates a list of all the usernames
var SHIP_ID = []; //this creates a list of all the ids of the ships the players have chosen
var PLACE = []; //creates an array containing a list of all the positions of where the usernames and shipIDs are stored in there respective arrays
var i = 0;

io.sockets.on('connection', function(socket){ //this function runs when there is a websocket connection to the server
    socket.on('username',function(data){ //this function takes in the username inputted by the user and pushes it into an array
      USERNAME_LIST.push(data.name);
    });

    socket.on('shipID',function(data){ //this function takes in the shipID of the users chosen ship and pushes it into an array
      SHIP_ID.push(data.id);
    });
    var length = USERNAME_LIST.length;
    socket.emit('connections',{ //this emits the number of playes currently in the lobby
      con:length
    });

    socket.on('start',function(data){//this function starts when the user enters the game screen
    listOfSockets[socket.id] = socket; //this adds each connection to the game
    Player.onConnect(socket); //this creates a new player when a new player joins
    PLACE[socket.id] = i; //this adds the position of each username and shipID to an array to use for later
    i++;
    var sql = "INSERT INTO Users (username,shiptype) VALUES ?" //this contains the necessary sql syntax to store a user and the ship they chose in a database
    var values = [
      [USERNAME_LIST[USERNAME_LIST.length-1],SHIP_ID[SHIP_ID.length-1]] //this value store the values you want to add
    ];
    con.query(sql,[values],function(err,result){ //this function queries and adds the new data
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows); //this line logs to the console how many rows in the database were affected
    });

    socket.emit('ship',{

      shipID:SHIP_ID[SHIP_ID.length-1] //this emits the shipID that the player chose
    });
  });

    socket.on('disconnect',function(){ //this function is called when the user disconnects
        delete listOfSockets[socket.id]; //this deletes the socket connection id the user made when they disconnect
        var place = PLACE[socket.id]; //this finds the place of the username and shipID
        var sql = "DELETE FROM Users WHERE username = ?" //the sql syntax for deleting a row in the database
        var values = [
          [[USERNAME_LIST[place]]] //value of username
        ];
        con.query(sql,[values],function(err,result){ //queries database to delete user
          if (err) throw err;
          console.log("Number of records deleted: " + result.affectedRows);
        });

        delete USERNAME_LIST[place]; //deletes user from array
        delete SHIP_ID[place]; //deletes shipID from array
        delete PLACE[socket.id]; //deletes number where shipID and username exists from array
        Player.onDisconnect(socket.id); //removes the players

});
});

setInterval(function(){
    var update = {
        player:Player.update(),
        bullet:Bullet.update(),
    }

    for(var i in listOfSockets){
        var socket = listOfSockets[i];
        socket.emit('newPositions',update);
    }
},1000/25);
