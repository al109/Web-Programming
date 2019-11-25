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
var listOfSockets = {};
//some of the functionality of the game was inspired from a youtube series, here is a link to the playlist, https://www.youtube.com/watch?v=PfSwUOBL1YQ&list=PLcIaPHraYF7k4FbeGIDY-1mZZdjTu9QyL
var Unit = function(){//This is created to avoide duplicate code in bullet and player variables.
    var self = {//creates all the variables need for bullets and player.
        x:200,
        y:200,
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
    var self = Unit(); //Calls Identity as a base for self
    self.id = id;//The id of the  PLayer
    self.clickRight = false;//The next 5 variables are there to indicate if a button is being pressed
    self.clickLeft = false;
    self.clickUp = false;
    self.clickDown = false;
    self.pressingAttack = false;
    self.score = 0;//The players in-game score
    self.limit = 0;//This is to limit where the player can go, so the don't go  outside of the canvas
    self.maxSpd = 10; //This is the maximum speed of the player
    self.rotation = rotation; //This indicates the orientation of the player's ship
    self.ship = ship; //this which ship the player picked
    self.username = username; //this is the players username
    var overwrite_update = self.update;
    self.update = function(){
        self.updateSpd(); //this is calling the update function contained within the player function
        overwrite_update(); //this calls the update function contained in the Entity function

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
        if(self.clickRight){//If the d key is being pressed
            if(self.x < self.limit){//This makes sure the player cannot leave the canvas
                self.spdX = self.maxSpd; //Sets the spd of the player equal to max speed, this is for the x coordinate
            }
            else{//If the player is greater than the limit
                self.spdX = 0;//The speed gets set to zero so the player cant go any further.
            }
        }
        else if(self.clickLeft)//If the A key is being pressed
        if(self.x > self.limit){//This makes sure the player cannot leave the canvas
            self.spdX = -self.maxSpd;//Sets the spd of the player equal to the negative max speed, this is for the x coordinate
                //This means the ship will go left.
        }
        else{//If the player is greater than the limit
            self.spdX = 0;////The speed gets set to zero so the player cant go any further.
        }
        else
            self.spdX = 0;//If neither left or right is being pressed then the speed for x gets set to 0

        if(self.clickDown){//If the S key is being pressed.

            if(self.y < self.limit - 40){//Makes sure player can't leave canvas
                self.spdY = self.maxSpd;//sets speed of Y to maxspeed so character can go down
                }
            else{
                self.spdY = 0;//if reached the limits then speed gets set to 0
            }
            }
        else if(self.clickUp)//if the W key is being pressed
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
Player.onConnect = function(socket){ //this function is called when the user connect to the game file
    var player = Player(socket.id,0,SHIP_ID[SHIP_ID.length-1],USERNAME_LIST[USERNAME_LIST.length-1]); //creates new player
    socket.on('keyPress',function(data){ //this is called when then keyPress socket is emitted

        if(data.inputId === 'left') //when the inputID of the keypress emitted is left
            player.clickLeft = data.state; //the state of clickLeft is changed to true or false,true if key is held down, false if released
            player.limit = data.limit; //limit of border is changed depending on key pressed
            if(data.rotation == 1){ //if key is released keep rotation same as last key pressed
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation; //otherwise set new rotation
}
        if(data.inputId === 'right') //same as before only difference is this is the right key
            player.clickRight = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;

  }

        if(data.inputId === 'up')//same as before only difference is this is the up key
            player.clickUp = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;


}

        if(data.inputId === 'down') //same as before only difference is this is the down key
            player.clickDown = data.state;
            player.limit = data.limit;
            if(data.rotation == 1){
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation;

}

        if(data.inputId === 'attack') //when the user hits space bar to shoot
            player.pressingAttack = data.state; //changes state of pressingAttack to true/false
            player.limit = data.limit; //sets limit to new limit
            if(data.rotation == 1){ //sets rotation to be the same as the last known rotation
              player.rotation = player.rotation;
            } else {
            player.rotation = data.rotation; //sets rotation to new rotation

          }
    });
}
Player.onDisconnect = function(socket){
    delete Player.list[socket.id]; //deletes player from list
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
    var self = Unit();//This calls on entity as a base for the bullet.
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

var USERNAME_LIST = []; //this creates a list of all the usernames
var SHIP_ID = []; //this creates a list of all the ids of the ships the players have chosen
var PLACE = []; //creates an array containing a list of all the positions of where the usernames and shipIDs are stored in there respective arrays
var AmountOfPlayers = [];
var i = 0;

io.sockets.on('connection', function(socket){ //this function runs when there is a websocket connection to the server
    AmountOfPlayers.push(1);
    socket.on('username',function(data){ //this function takes in the username inputted by the user and pushes it into an array
      USERNAME_LIST.push(data.name);
    });

    socket.on('shipID',function(data){ //this function takes in the shipID of the users chosen ship and pushes it into an array
      SHIP_ID.push(data.id);
    });

    socket.emit('connections',{ //this emits the number of playes currently in the lobby
      con:AmountOfPlayers.length
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
        AmountOfPlayers.shift();
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
        Player.onDisconnect(socket); //removes the players

});
});

setInterval(function(){
    var update = { //this varaible store the updated positions for the player and bullet
        player:Player.update(),
        bullet:Bullet.update(),
    }

    for(var i in listOfSockets){ //this loops through all the connections
        var socket = listOfSockets[i];
        socket.emit('newPositions',update); //this emits the connections with the updated player and bullet positions
    }
},1000/25); //this function runs 4 times a second
