var limit = 0;
var socket = io.connect('http://localhost:2000');
var ctx = document.getElementById("ctx");
var c = document.getElementById("ctx");
var ctx = c.getContext("2d");
canvas = document.getElementById("ctx")
canvas.width = window.innerWidth - 200 ;
canvas.height = window.innerHeight -15;
var ScoreBoard = [];
var Usernames = [];
var image;
ctx.font = "30px Arial";
ctx.fillStyle = "red";
var TO_RADIANS = Math.PI/180;
var playerScore = document.getElementById('Player_score');
var place = 0;
socket.on('place',function(data){
  place = data.place
});

socket.emit('start',{
  name: "Yooo, it started lads"

});
socket.on('ship',function(data){
  image = document.getElementById(data.shipID);
  console.log(data.shipID);
});

socket.on('newPositions',function(data){

  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(var i = 0; i < data.player.length;i++){
      ScoreBoard[i] = document.getElementById("score" + (1+i));
      Usernames[i] = document.getElementById("user" + (1+i));
  }
    for(var i = 0; i < data.player.length;i++){
      ScoreBoard[i].innerHTML  = data.player[i].score;
      image = document.getElementById(data.player[i].ship);
      playerScore.innerHTML = data.player[place].score;
      rotateAndPaintImage(ctx,image,data.player[i].rotation*TO_RADIANS,data.player[i].x,data.player[i].y,20,30);
    }
    for(var i = 0 ; i < data.bullet.length; i++)

      ctx.fillRect(data.bullet[i].x-5,data.bullet[i].y-5,10,10);
          });

          document.onkeydown = function(event){
              if(event.keyCode === 68){
                  limit =   window.innerWidth -190; //d
                  socket.emit('keyPress',{
                    inputId:'right',
                    state:true,
                    rotation:90,
                    limit: limit
                  });}
              else if(event.keyCode === 83){
                  limit = window.innerHeight; //s
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
function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
  context.translate( positionX, positionY );
  context.rotate( angleInRad );
  context.drawImage( image, -axisX, -axisY ,40,40);
  context.rotate( -angleInRad );
  context.translate( -positionX, -positionY );
}
