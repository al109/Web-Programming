
var socket = io.connect('http://localhost:2000');
var ctx = document.getElementById("ctx");
var c = document.getElementById("ctx");
var ctx = c.getContext("2d");
image = document.getElementById("ship");
ctx.font = "30px Arial";
var TO_RADIANS = Math.PI/180;
var username;
canvas = document.getElementById("ctx")
canvas.width = window.innerWidth -150 ;
canvas.height = window.innerHeight -15;
var userInput = document.getElementById('userInput');
var loginButton = document.getElementById('loginBtt');
//emit an even when someone logs in with new user
if(username == null){
loginButton.addEventListener('click',function(){
  username = loginButton.value
});
}
socket.emit('start',{

  name: username

});
socket.on('newPositions',function(data){
  ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < data.length;i++)

      rotateAndPaintImage(ctx,image,data[i].rotation*TO_RADIANS,data[i].x,data[i].y,20,30);
});

document.onkeydown = function(event){
  if(event.keyCode==68)
    socket.emit('keyPress',{
      inputId:'right',
      state:true,
      rotation:90
});
  else if(event.keyCode==83)
  socket.emit('keyPress',{
    inputId:'down',
    state:true,
    rotation:180
});
  else if(event.keyCode==65)
  socket.emit('keyPress',{
    inputId:'left',
    state:true,
    rotation:270
});
  else if(event.keyCode==87)
  socket.emit('keyPress',{
    inputId:'up',
    state:true,
    rotation:0
});
}

document.onkeyup = function(event){
  if(event.keyCode==68)
    socket.emit('keyPress',{
      inputId:'right',
      state:false,
      rotation:90
});
  else if(event.keyCode==83)
  socket.emit('keyPress',{
    inputId:'down',
    state:false,
    rotation:180
});
  else if(event.keyCode==65)
  socket.emit('keyPress',{
    inputId:'left',
    state:false,
    rotation:270
});
  else if(event.keyCode==87)
  socket.emit('keyPress',{
    inputId:'up',
    state:false,
    rotation:0
});
}
function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY ,40,40);
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}

var playerBullets = [];
