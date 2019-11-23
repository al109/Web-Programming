
var socket = io.connect('http://10.0.1.17:2000');
var ctx = document.getElementById("ctx");
var c = document.getElementById("ctx");
var ctx = c.getContext("2d");
image = document.getElementById("ship");
ctx.font = "30px Arial";
var TO_RADIANS = Math.PI/180;
var rot = 0;
canvas = document.getElementById("ctx")
canvas.width = window.innerWidth -150 ;
canvas.height = window.innerHeight -15;
socket.emit('start',{
  name: "Yooo, it started lads"

});
socket.on('newPositions',function(data){
  ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < data.length;i++){
      if(i != 0){
        if(data[i-1].x == data[i].x && data[i-1].y == data[i].y){
            data[i].x -= 15;
            data[i].y -= 15;
        }
      }
      if (data[i].x > window.innerWidth -190) {
          data[i].x = window.innerWidth -190;
        }
        if (data[i].x < 40) {
          data[i].x = 40;
        }
        if (data[i].y > window.innerHeight-40) {
          data[i].y = window.innerHeight-40;
        }
        if (data[i].y < 40) {
          data[i].y = 40;
        }
      console.log(data[i].bullets);
      rotateAndPaintImage(ctx,image,data[i].rotation*TO_RADIANS,data[i].x,data[i].y,20,30);
      
    }
    
});

document.onkeydown = function(event){
  if(event.keyCode==68){
    rot = 90;
    socket.emit('keyPress',{
      inputId:'right',
      state:true,
      rotation:90
});}
  else if(event.keyCode==83){
  rot = 180;
  socket.emit('keyPress',{
    inputId:'down',
    state:true,
    rotation:180
});}
  else if(event.keyCode==65){
  rot = 270;
  socket.emit('keyPress',{
    inputId:'left',
    state:true,
    rotation:270
});}
  else if(event.keyCode==87){
    rot = 0;
  socket.emit('keyPress',{
    inputId:'up',
    state:true,
    rotation:0
});}
else if(event.keyCode==32){
socket.emit('keyPress',{
    inputId:'space',
    state:true,
    rotation:rot
});}
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
else if(event.keyCode==32)
  socket.emit('keyPress',{
    inputId:'space',
    state:false,
    rotation: rot
});
}
function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY ,40,40);
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}



