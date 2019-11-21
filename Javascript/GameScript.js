
var socket = io.connect('http://localhost:2000');
var ctx = document.getElementById("ctx");
var c = document.getElementById("ctx");
var ctx = c.getContext("2d");
image = document.getElementById("ship");
ctx.font = "30px Arial";
var TO_RADIANS = Math.PI/180;
var rot = 0;

socket.emit('start',{
  name: "Yooo, it started lads"

});
socket.on('newPositions',function(data){
  ctx.clearRect(0,0,500,500);
    for(var i = 0; i < data.length;i++)
  rotateAndPaintImage ( ctx, image, rot*TO_RADIANS, 200, 100, data[i].x, data[i].y );
  rot += 45;
});

function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  ctx.translate( positionX, positionY );
  ctx.rotate( angleInRad );
  ctx.drawImage( image, -axisX, -axisY ,40,40);
  ctx.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}
