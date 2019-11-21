image2 = document.getElementById("bullet");
image = document.getElementById("ship");
var socket = io.connect('http://localhost:2000');
var friction = 0.98

function startGame() {

    myGameArea.start();
    myGamePiece = new shipComponent();
    socket.emit('start',{
      name: "Yooo, it started lads"

    });
}
function createBullet(){
    bullet = new bulletComponent();
}

function moveBullet(){

}
 var myGameArea = {

     canvas : document.createElement("canvas"),
     start : function() {
        this.canvas.width = window.innerWidth -150 ;
        this.canvas.height = window.innerHeight -15;
        canvas.style.position = "absolute";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
             myGameArea.key = e.keyCode;
         })
         window.addEventListener('keyup', function (e) {
             myGameArea.key = false;
         })
     },
     clear : function(){
         this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
     }


    }


function shipComponent() {
          this.gamearea = myGameArea;
          this.x = 150,
          this.y = 150,
          this.velY = 0,
          this.velX = 0,
          this.speed = 2,
          this.update = function() {
              ctx = myGameArea.context;
              ctx.beginPath();
              ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
              ctx.drawImage(image, this.x,this.y, 40,40)

          }
          this.newPos = function() {
              this.x += this.velX;
              this.y += this.velY;
              if (this.x >= window.innerWidth -190) {
                this.x = 5;
              } else if (this.x <= 5) {
                this.x = window.innerWidth -190;
              }

              if (this.y > window.innerHeight - 40) {
                this.y = 5;
              } else if (this.y <= 5) {
                this.y = window.innerHeight - 40;
              }

          }
    }
function bulletComponent(){
    var bulY = myGamePiece.y;
    var bulX = myGamePiece.x + 15;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.drawImage(image2, bulX,bulY, 10,10)

    }
    this.newPos = function(){

        bulY -= 15;
    }
}

function updateGameArea() {
    myGameArea.clear();

    if (myGameArea.key && myGameArea.key == 32) {

        createBullet();

    }
    if (myGameArea.key && myGameArea.key == 87) {
        if (myGamePiece.velY > -myGamePiece.speed) {
            myGamePiece.velY--;

        }
    }

    if (myGameArea.key && myGameArea.key == 83) {
        if (myGamePiece.velY < myGamePiece.speed) {
            myGamePiece.velY++;

        }
    }
    if (myGameArea.key && myGameArea.key == 68) {
        if (myGamePiece.velX < myGamePiece.speed) {
            myGamePiece.velX++;
        }
    }
    if (myGameArea.key && myGameArea.key == 65) {
        if (myGamePiece.velX > -myGamePiece.speed) {
            myGamePiece.velX--;
        }
    }



    myGamePiece.velY *= friction;
    myGamePiece.velX *= friction;


    myGamePiece.newPos();
    myGamePiece.update();



}
