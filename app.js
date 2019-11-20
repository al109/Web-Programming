var express = require('express')
var app = express();
var serv = require('http').Server(app);
var socket = require('socket.io')
let mysql = require('mysql');

let con = mysql.createConnection({
    host: 'sql2.freesqldatabase.com',
    user: 'sql2312807',
    password: 'yB7%iC5*',
    database: 'sql2312807'
});


app.get('/' ,function(req,res) {
  res.sendFile(__dirname + '/index.html');

});
app.use('/',express.static(__dirname + '/'));
app.use('/Javascript',express.static(__dirname + '/Javascript'));
app.use('/Style',express.static(__dirname + '/Style'));

serv.listen(2000);
console.log("Server started");

var io = socket(serv);

io.sockets.on('connection',function(socket){
  console.log('made socket connection',socket.id)
  socket.on('username',function(data){
    con.connect(function(err) {
    var sql = 'INSERT INTO Users (username) VALUES ?';
    var values = [[data.name]];
    console.log(data.name);
    con.query(sql,[values],function(err,result){
      if (err) throw err;
      console.log("IT WORKED REEEEE")
    });
  });
  });
});
