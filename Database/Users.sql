/* create the Users table to store: */
CREATE TABLE Users(
  /* a userID that is incremented every time a new User entry is created, it is also a primary key */
  userID INTEGER AUTO_INCREMENT PRIMARY KEY,
  /* the username of a player with a maximum length of 15 of any characters */
  username VARCHAR(15) NOT NULL,
  /* a ship type: the user can choose 1 of 6 ship sprites to use in the customise screen of the game */
  shiptype INTEGER NOT NULL
);
