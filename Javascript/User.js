var socket = io.connect('http://localhost:2000');

var userInput = document.getElementById('userInput');
var loginButton = document.getElementById('loginBtt');
var name = userInput.value;
//emit an even when someone logs in with new user



loginButton.addEventListener('click',function()

{
  if(userInput.value == ""){
    var link = document.getElementById('file');
    link.setAttribute('href',"index.html");
    alert("please input a username"); //returns user to login page if they haven't entered a username
  } else
  socket.emit('username',{
    name: userInput.value //emits username when clicked

  });
});
