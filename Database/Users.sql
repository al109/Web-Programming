CREATE TABLE Users(
  username VARCHAR(15) NOT NULL PRIMARY KEY,
  surname VARCHAR(15),
  firstName VARCHAR(15),
  email VARCHAR(25),
  password VARCHAR(30)
);

INSERT INTO Users VALUES("Coburn", "Andrew", "ajc15@hw.ac.uk", "AJC257", "example1234");
