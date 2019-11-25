
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
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
} //to do

//javascript function to open the sidenav menu in game.html
function openNav() {
  //when the button is clicked this will set the sidenav menu's width to 250px, from 0px, making it visible on screen
  document.getElementById("mySidenav").style.width = "250px";
}

//javascript function to close the sidenav menu in game.html
function closeNav() {
  //when the close button is clicked this will set the sidenav menu's width back to 0px, making it disappear from the screen
  document.getElementById("mySidenav").style.width = "0";
}
