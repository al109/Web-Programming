
var socket = io.connect('http://localhost:2000');
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
                  socket.emit('keyPress',{
                    inputId:'right',
                    state:true,
                    rotation:90
                  });
              else if(event.keyCode === 83)   //s
                  socket.emit('keyPress',{
                    inputId:'down',
                    state:true,
                    rotation: 180
                  });
              else if(event.keyCode === 65) //a
                  socket.emit('keyPress',{
                    inputId:'left',
                    state:true,
                    rotation:270
                  });
              else if(event.keyCode === 87) // w
                  socket.emit('keyPress',{
                    inputId:'up',
                    state:true,
                    rotation:0
                  });
              if(event.keyCode === 32)
                  socket.emit('keyPress',{
                      inputId:'attack',
                      state:true,
                      rotation:1
                    });
          }
          document.onkeyup = function(event){
              if(event.keyCode === 68)    //d
                  socket.emit('keyPress',{
                    inputId:'right',
                    state:false,
                    rotation:1
                  });
              else if(event.keyCode === 83)   //s
                  socket.emit('keyPress',{
                    inputId:'down',
                    state:false,
                    rotation:1
                  });
              else if(event.keyCode === 65) //a
                  socket.emit('keyPress',{
                    inputId:'left',
                    state:false,
                    rotation:1
                  });
              else if(event.keyCode === 87) // w
                  socket.emit('keyPress',{
                    inputId:'up',
                    state:false,
                    rotation:1
                  });
              if(event.keyCode === 32)
                  socket.emit('keyPress',{
                      inputId:'attack',
                      state:false,
                      rotation:1
                        });



}
function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY ,40,40);
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}
