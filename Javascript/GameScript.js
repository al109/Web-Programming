var limit = 0; //creates a variable for the limit
var socket = io.connect('http://localhost:2000'); //creates a socket connection
 //gets the canvas from the html file
var c = document.getElementById("ctx"); //gets the canvas from the html file
var ctx = c.getContext("2d");
canvas = document.getElementById("ctx");
canvas.width = window.innerWidth - 200 ; //gets the canvas' width
canvas.height = window.innerHeight -15; //gets the canvas' height
var ScoreBoard = []; //creates an array of the scoreboard
var Usernames = []; //creates an array of the usernames
var image;
ctx.font = "30px Arial";
ctx.fillStyle = "red";
var TO_RADIANS = Math.PI/180; //used to find angle for rotation


socket.emit('start',{
  name: "Yooo, it started lads"

});
socket.on('ship',function(data){ //gets the data of ship chosen by user
  image = document.getElementById(data.shipID);
  console.log(data.shipID);
});


socket.on('newPositions',function(data){ //when newPositions socket is called the data is passed here

  ctx.clearRect(0,0,canvas.width,canvas.height); //clears the entire canvas

  for(var i = 0; i < data.player.length;i++){ //loops through all the values in the player array

      ScoreBoard[i] = document.getElementById("score" + (1+i)); //sets up the scoreboard from the html file
      Usernames[i] = document.getElementById("user" + (1+i)); //sets up the usernames to be displayed from the html
  }
    for(var i = 0; i < data.player.length;i++){ //loops through the player data
      ScoreBoard[i].innerHTML  = data.player[i].score; //sets score for all the users and displays there score
      Usernames[i].innerHTML = data.player[i].username; //sets usernames to be displayed alongside there score
      image = document.getElementById(data.player[i].ship); //sets image to be same image they picked
      Rotate(ctx,image,data.player[i].rotation*TO_RADIANS,data.player[i].x,data.player[i].y,20,30); //calls Rotate function to rotate the image, and updates positions of all ships
    }
    for(var i = 0 ; i < data.bullet.length; i++) //loops through all data in the bullet

      ctx.fillRect(data.bullet[i].x-5,data.bullet[i].y-5,10,10); //keeps updating bullet positions and creating new bullets
          });

          document.onkeydown = function(event){ //when a key is pressed
              if(event.keyCode === 68){ //w
                  limit =   window.innerWidth -190; //sets new limit
                  socket.emit('keyPress',{ //emits a keyPress
                    inputId:'right', //sends data as to which key was pressed
                    state:true, //as this is a keydown even the state emitted is true
                    rotation:90, //emits rotation to 90 as you want the ship to rotate by 90 degrees
                    limit: limit //sets the limit
                  });}
              else if(event.keyCode === 83){ //s
                  limit = window.innerHeight;
                  socket.emit('keyPress',{
                    inputId:'down',
                    state:true,
                    rotation: 180,
                    limit: window.innerHeight -40
                  });}
              else if(event.keyCode === 65){
                limit = 5;//a
                  socket.emit('keyPress',{
                    inputId:'left',
                    state:true,
                    rotation:270,
                    limit: limit
                  });}
              else if(event.keyCode === 87){
                  limit = 0; // w
                  socket.emit('keyPress',{
                    inputId:'up',
                    state:true,
                    rotation:0,
                    limit: limit
                  });}
              if(event.keyCode === 32){
                  console.log(limit);
                  socket.emit('keyPress',{
                      inputId:'attack',
                      state:true,
                      rotation:1,
                      limit: limit
                    });
              }
          }
          document.onkeyup = function(event){
              if(event.keyCode === 68)    //d
                  socket.emit('keyPress',{
                    inputId:'right',
                    state:false,
                    rotation:1,
                    limit: limit
                  });
              else if(event.keyCode === 83)   //s
                  socket.emit('keyPress',{
                    inputId:'down',
                    state:false,
                    rotation:1,
                    limit: limit
                  });
              else if(event.keyCode === 65) //a
                  socket.emit('keyPress',{
                    inputId:'left',
                    state:false,
                    rotation:1,
                    limit: limit
                  });
              else if(event.keyCode === 87) // w
                  socket.emit('keyPress',{
                    inputId:'up',
                    state:false,
                    rotation:1,
                    limit: limit
                  });
              if(event.keyCode === 32){
                  socket.emit('keyPress',{
                      inputId:'attack',
                      state:false,
                      rotation:1,
                      limit: limit
                        });

                      }

}
function Rotate ( ctx, img, angle , posX, posY, y, x ) { //this function rotates and prints an image, it was inspired off this function,
  ctx.translate( posX, posY );
  ctx.rotate( angle );
  ctx.drawImage( img, -x, -y ,40,40);
  ctx.rotate( -angle );
  ctx.translate( -posX, -posY );
}
