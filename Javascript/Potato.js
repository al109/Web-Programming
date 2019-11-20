var socket = io.connect('http://localhost:2000');

var userInput = document.getElementById('userInput');
var loginButton = document.getElementById('loginBtt');

//emit an even when someone logs in with new user
loginButton.addEventListener('click',function(){
  socket.emit('username',{
    name: userInput.value

  });
});
