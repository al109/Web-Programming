var myGamePiece;
var socket = io.connect('http://localhost:2000');

function startGame() {
    myGameArea.start();
    myGamePiece = new component(40, 40, "red", 10, 120);

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1400;
        this.canvas.height = 760;
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

function component(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    image = document.getElementById("ship");
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.drawImage(image, this.x, this.y,this.width,this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key && myGameArea.key == 37) {if(myGamePiece.x <= 10){myGamePiece.speedX = 0;}else{myGamePiece.speedX = -15;}}
    if (myGameArea.key && myGameArea.key == 39) {if(myGamePiece.x >= 1320){myGamePiece.speedX = 0;}else{myGamePiece.speedX = 15;} }
    if (myGameArea.key && myGameArea.key == 38) {if(myGamePiece.y <= 10){myGamePiece.speedY = 0;}else{myGamePiece.speedY = -15;} }
    if (myGameArea.key && myGameArea.key == 40) {if(myGamePiece.y >= 720){myGamePiece.speedY = 0;}else{myGamePiece.speedY = 15;} }
    myGamePiece.newPos();
    myGamePiece.update();
}
