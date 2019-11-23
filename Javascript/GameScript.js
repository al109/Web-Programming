
var socket = io.connect('http://10.0.1.17:2000');
var ctx = document.getElementById("ctx");
var c = document.getElementById("ctx");
var ctx = c.getContext("2d");
canvas = document.getElementById("ctx")
canvas.width = window.innerWidth -150 ;
canvas.height = window.innerHeight -15;
image = document.getElementById("ship");
ctx.font = "30px Arial";
var TO_RADIANS = Math.PI/180;


socket.emit('start',{
  name: "Yooo, it started lads"

});
socket.on('newPositions',function(data){
  ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < data.player.length;i++)
      rotateAndPaintImage(ctx,image,data.player[i].rotation*TO_RADIANS,data.player[i].x,data.player[i].y,20,30);
    for(var i = 0 ; i < data.bullet.length; i++)
      ctx.fillRect(data.bullet[i].x-5,data.bullet[i].y-5,10,10);
          });

          document.onkeydown = function(event){
              if(event.keyCode === 68)    //d
                  socket.emit('keyPress',{inputId:'right',state:true});
              else if(event.keyCode === 83)   //s
                  socket.emit('keyPress',{inputId:'down',state:true});
              else if(event.keyCode === 65) //a
                  socket.emit('keyPress',{inputId:'left',state:true});
              else if(event.keyCode === 87) // w
                  socket.emit('keyPress',{inputId:'up',state:true});

          }
          document.onkeyup = function(event){
              if(event.keyCode === 68)    //d
                  socket.emit('keyPress',{inputId:'right',state:false,rotation:90});
              else if(event.keyCode === 83)   //s
                  socket.emit('keyPress',{inputId:'down',state:false});
              else if(event.keyCode === 65) //a
                  socket.emit('keyPress',{inputId:'left',state:false});
              else if(event.keyCode === 87) // w
                  socket.emit('keyPress',{inputId:'up',state:false});
          }

          document.onmousedown = function(event){
              socket.emit('keyPress',{inputId:'attack',state:true});
          }
          document.onmouseup = function(event){
              socket.emit('keyPress',{inputId:'attack',state:false});
          }
          document.onmousemove = function(event){
              var x = -250 + event.clientX - 8;
              var y = -250 + event.clientY - 8;
              var angle = Math.atan2(y,x) / Math.PI * 180;
              socket.emit('keyPress',{inputId:'mouseAngle',state:angle});

}
function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY ,40,40);
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}
