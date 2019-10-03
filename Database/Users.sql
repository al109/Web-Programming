CREATE TABLE Users(
  username VARCHAR(15) NOT NULL PRIMARY KEY,
  surname VARCHAR(15),
  firstName VARCHAR(15),
  email VARCHAR(25),
  password VARCHAR(30)
);

CREATE TABLE SpaceShip(
  shipName VARCHAR(15) NOT NULL PRIMARY KEY,
  captain VARCHAR(15),
  mainColour VARCHAR(10),
  secondColour VARCHAR(10),
  FOREIGN KEY (captain) REFERENCES Users(username)
);

INSERT INTO Users VALUES("AJC257", "Coburn", "Andrew", "ajc15@hw.ac.uk", "example1234");
INSERT INTO SpaceShip VALUES("U.S.S Example", "AJC257", "green", "purple");
