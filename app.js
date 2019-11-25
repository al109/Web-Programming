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

var Entity = function(){//This is created to avoide duplicate code in bullet and player variables.
    var self = {//creates all the variables need for bullets and player.
        x:150,
        y:150,
        spdX:0,
        spdY:0,
        id:"",
    }
    //calls updatePosition
    self.update = function(){
        self.updatePosition();
    }
    self.updatePosition = function(){//This updates the position of the object.

        self.x += self.spdX;//adds the speeds on to the x and y positions so the player will move.
        self.y += self.spdY;
    }
    self.getDistance = function(pt){//This gets the distance between two objects.
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    }
    return self;
}
//This is the player variable, this is where most of the data about the  player is stored
var Player = function(id,rotation,ship,username){
    var self = Entity(); //Calls Identity as a base for self
    self.id = id;//The id of the  PLayer
    self.pressingRight = false;//The next 5 variables are there to indicate if a button is being pressed 
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.score = 0;//The players in-game score
    self.limit = 0;//This is to limit where the player can go, so the don't go  outside of the canvas
    self.maxSpd = 10; //This is the maximum speed of the player
    self.rotation = rotation; //This indicates the orientation of the player's ship
    self.ship = ship; //this which ship the player picked
    self.username = username; //this is the players username
    var super_update = self.update;
    self.update = function(){
        self.updateSpd();
        super_update();

        if(self.pressingAttack){//If the space key is pressed, then this will = true
            self.shootBullet(self.rotation-90);//calls to shoot the bullet with the angle the bullet will get shot at
        }
    }
    self.shootBullet = function(angle){//Function used to shoot the bullet.
        var b = Bullet(self.id,angle); //creates a bullet, with the players ID and the angle it will be shot at
        b.x = self.x; //Put the bullet at the same x and y as the player 
        b.y = self.y;
    }

    //
    self.updateSpd = function(){//This updates the direction the player will go in
        if(self.pressingRight){//If the d key is being pressed
            if(self.x < self.limit){//This makes sure the player cannot leave the canvas
                self.spdX = self.maxSpd; //Sets the spd of the player equal to max speed, this is for the x coordinate
            }
            else{//If the player is greater than the limit 
                self.spdX = 0;//The speed gets set to zero so the player cant go any further.
            }
        }
        else if(self.pressingLeft)//If the A key is being pressed
        if(self.x > self.limit){//This makes sure the player cannot leave the canvas
            self.spdX = -self.maxSpd;//Sets the spd of the player equal to the negative max speed, this is for the x coordinate
                //This means the ship will go left.
        }
        else{//If the player is greater than the limit 
            self.spdX = 0;////The speed gets set to zero so the player cant go any further.
        }
        else
            self.spdX = 0;//If neither left or right is being pressed then the speed for x gets set to 0

        if(self.pressingDown){//If the S key is being pressed.

            if(self.y < self.limit - 40){//Makes sure player can't leave canvas
                self.spdY = self.maxSpd;//sets speed of Y to maxspeed so character can go down
                }
            else{
                self.spdY = 0;//if reached the limits then speed gets set to 0
            }
            }
        else if(self.pressingUp)//if the W key is being pressed
            if(self.y > self.limit){//Checks that player is still within the limit
                self.spdY = -self.maxSpd;//sets the speed of the ship to negative max speed so it can go up.
             }
            else{
             self.spdY = 0;//if reached the limits then speed gets set to 0
            }


        else{

            self.spdY = 0;//If neither left or right is being pressed then the speed for x gets set to 0

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
Player.update = function(){//This function adds stuff to a list to be sent to the javascript
    var pack = [];//creates the list
    for(var i in Player.list){//For each  player in the game.
        var player = Player.list[i];
        player.update();//calls the update function in the player variable.
        pack.push({//Pushes all the player data that needs to get sent to javascript
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
    var self = Entity();//This calls on entity as a base for the bullet.
    self.id = Math.random();//Creates an ID for the bullet
    self.spdX = Math.cos(angle/180*Math.PI) * 20;//This calculates the velocity of the bullets x axis.
    self.spdY = Math.sin(angle/180*Math.PI) * 20;//This calculates the velocity of the bullets y axis.
    self.parent = parent;//This stores which player shot the bullet
    self.timer = 0;//This is a timer to make sure the bullet dosent stay on the screeen forever.
    self.toRemove = false;//This checks if the bullet needs to dissapear from the screen
    var super_update = self.update;
    self.update = function(){//Updates the bullets position
        if(self.timer++ > 100)//This is the timer that makes sure the bullet leaves after 100 loops
            self.toRemove = true;
        super_update();

        for(var i in Player.list){//For every player in the game.
            var p = Player.list[i];
            //If a player gets hit, thats not the player that shot the bullet
            if(self.getDistance(p) < 25 && self.parent !== p.id){
                //These respawn the player after its been hit by a ship
                p.x = 150;
                p.y = 150;
                //Adds 1 on to the score of the player that shot the bullet
                Player.list[self.parent].score ++;
                //handle collision. ex: hp--;
                self.toRemove = true;
            }

        }
    }
    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};//ctreates a list for the bullets

Bullet.update = function(){//Update function for the bullets
    var pack = [];//pack to send to the javascript file.
    for(var i in Bullet.list){//For each bullet in the list.
        var bullet = Bullet.list[i];
        bullet.update();//Calls the update function made in the Bullet object variable 
        if(bullet.toRemove)//If the bullet.toRemove equals true then it gets deleted.
            delete Bullet.list[i];
        else
            pack.push({//Adds the bullets x and y coordinates the pack
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
    socket.emit('connections',{
      con:USERNAME_LIST.length
    });
    console.log(SOCKET_LIST.length);
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
      console.log("Number of records inserted: " + result.affectedRows);
    });

    socket.emit('ship',{

      shipID:SHIP_ID[SHIP_ID.length-1]
    });
  });

    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        var place = PLACE[socket.id];
        var sql = "DELETE FROM Users WHERE username = ?"
        var values = [
          [[USERNAME_LIST[place]]]
        ];
        con.query(sql,[values],function(err,result){
          if (err) throw err;
          console.log("Number of records deleted: " + result.affectedRows);
        });

        delete USERNAME_LIST[place];
        delete SHIP_ID[place];
        delete PLACE[socket.id];
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
