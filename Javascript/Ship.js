var socket = io.connect('http://localhost:2000');

var btn1 = document.getElementById('btn1'); //created variables for all the buttons
var btn2 = document.getElementById('btn2');
var btn3 = document.getElementById('btn3');
var btn4 = document.getElementById('btn4');
var btn5 = document.getElementById('btn5');
var btn6 = document.getElementById('btn6');
var okBtn = document.getElementById('ok');
var noOfCon = 0; //finds out number of connections
var clickList = []; //array to store which ships were chosen
socket.on('connections',function(data){
  noOfCon = data.con;//updates number of connections
});

//emit an event when someone picks a new ship
btn1.addEventListener('click',function(){
  clickList.push("ship1"); //adds the ship to the end of the list
  socket.emit('shipID',{ //emits shipID of ship chosen
    id:"ship1"

  });
});

btn2.addEventListener('click',function(){
  clickList.push("ship1");
  socket.emit('shipID',{
    id:"ship2"

  });
});

btn3.addEventListener('click',function(){
  clickList.push("ship1");
  socket.emit('shipID',{
    id:"ship3"

  });
});

btn4.addEventListener('click',function(){
  clickList.push("ship1");
  socket.emit('shipID',{
    id:"ship4"

  });
});

btn5.addEventListener('click',function(){
  clickList.push("ship1");
  socket.emit('shipID',{
    id:"ship5"

  });
});

btn6.addEventListener('click',function(){
  clickList.push("ship1");
  socket.emit('shipID',{
    id:"ship6"

  });
});

okBtn.addEventListener('click',function(){ //event for when they want to go to the next screen
  if(clickList.length == 0){
    var link = document.getElementById('link');
    link.setAttribute('href',"customise.html");
    alert("Please select a ship!"); //returns user to customise screen again when they havent chosen a ship
    socket.emit('updateCon',{//updates number of connections
      con:1
    });
  } if(noOfCon > 10){
    var link = document.getElementById('link');
    link.setAttribute('href',"index.html"); //returns user when user has exceeded max number of connections
    alert("Too many connections!"); //alerts user to many connections
    socket.emit('updateCon',{ //updates number of connections
      con:2
    });
  }

});
