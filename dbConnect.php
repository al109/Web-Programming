<?php
$db = new SQLite3(':memory:');

$dbUsers = $db->exec("CREATE TABLE IF NOT EXISTS Users(
  username VARCHAR(15) NOT NULL PRIMARY KEY,
  shipType INT)");

#$username = $_POST["username"];
$shiptype = $_POST["shipNum"];

$db->exec("INSERT INTO Users VALUES('AJC257', 'ship3');");

?>
