var socket = io.connect('http://localhost:2000');

var btn1 = document.getElementById('btn1');
var btn2 = document.getElementById('btn2');
var btn3 = document.getElementById('btn3');
var btn4 = document.getElementById('btn4');
var btn5 = document.getElementById('btn5');
var btn6 = document.getElementById('btn6');


//emit an even when someone logs in with new user
btn1.addEventListener('click',function(){
  socket.emit('shipID',{
    id:"ship1"

  });
});

btn2.addEventListener('click',function(){
  socket.emit('shipID',{
    id:"ship2"

  });
});

btn3.addEventListener('click',function(){
  socket.emit('shipID',{
    id:"ship3"

  });
});

btn4.addEventListener('click',function(){
  socket.emit('shipID',{
    id:"ship4"

  });
});

btn5.addEventListener('click',function(){
  socket.emit('shipID',{
    id:"ship5"

  });
});

btn6.addEventListener('click',function(){
  socket.emit('shipID',{
    id:"ship6"

  });
});
