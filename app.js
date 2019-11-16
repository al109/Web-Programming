var express = require('express')
var app = express();
var serv = require('http').Server(app);

app.get('/' ,function(req,res) {
  res.sendFile(__dirname + '/game.html');
});
app.use('/javascript',express.static(__dirname + '/javascript'));
app.use('/Style',express.static(__dirname + '/Style'));
app.use('/',express.static(__dirname + '/index.html'));
app.use('/',express.static(__dirname + '/customise.html'));

serv.listen(2000);
