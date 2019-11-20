var socket = io.connect('http://localhost:2000');

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

 canvas.width = window.innerWidth - 150;
 canvas.height = window.innerHeight;
var x = 150,
    y = 150,
    velY = 0,
    velX = 0,
    speed = 2,
    friction = 0.98,
    keys = [];
    oldDegrees = 0
    newDegrees = 0
    image = document.getElementById("ship");
function update() {
    requestAnimationFrame(update);

    if (keys[87]) {
        if (velY > -speed) {
            velY--;

        }
    }

    if (keys[83]) {
        if (velY < speed) {
            velY++;

        }
    }
    if (keys[68]) {
        if (velX < speed) {
            velX++;
        }
    }
    if (keys[65]) {
        if (velX > -speed) {
            velX--;
        }
    }

    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    if (x >= canvas.width - 40) {
        x = canvas.width - 40;
    } else if (x <= 5) {
        x = 5;
    }

    if (y > canvas.height - 40) {
        y = canvas.height - 40;
    } else if (y <= 5) {
        y = 5;
    }

    ctx.clearRect(0, 0, 1300, 800);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);

    ctx.drawImage(image, x,y, 40,40);
}
update();

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
