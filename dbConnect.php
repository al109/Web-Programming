<?php
$db = new SQLite3(':memory:');

$dbUsers = $db->exec("CREATE TABLE IF NOT EXISTS Users(
  username VARCHAR(15) PRIMARY KEY,
  shipType INTEGER NOT NULL)");

#$username = $_POST["username"];
$shiptype = $_POST["shipNum"];

$db->exec("INSERT INTO Users VALUES('AJC257', 'Ship 3');");

?>
<!DOCTYPE html>
  <head>
    <link rel="stylesheet" type="text/css" href="Style/Style.css">

    <script src="Javascript/Script.js"></script>
    <title>Game</title>
    <style>
    canvas {

        background-image: url("Style/Images/sapce2.jpg");
        position: absolute;

    }
    </style>
    <img src="Style/Images/ship.png" id="ship" width="30" height="30" style="display: none;">
  </head>
  <body id="gameBody">
    <div id="mySidenav" class="sidenav">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="index.html">Log Out</a>
      <a href="customise.html">Customise</a>
    </div>

    <span onclick="openNav()">
      <input id="options" type="image" name="options" src="Style/Images/options.png">
    </span>
    <canvas id="canvas"></canvas>

<script src="Javascript/GameScript2.js">myGamePiece.backgroundImage = url("Style/Images/ship.png")> </script>

  </body>
</html>
