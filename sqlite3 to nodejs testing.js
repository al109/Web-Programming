const sqlite3 = require('sqlite3').verbose();

// open database in memory
let databasetest = new sqlite3.Database('/Database/Users.sql', (err) => {
  // if there is an error connecting to the database
  if (err) {
    //throw an error in the console
    return console.error(err.message);
  }
  //otherwise send a message to the console that it has connected
  console.log('Connected to the in-memory SQlite database.');
});

let sqlquery = 'Select * FROM Users';

databasetest.get(sqlquery, (err, row)) => {
  if (err){
    return console.error(err.message);
  }
  return row
    ? console.log(row.username, row.surname, row.firstName, row.email, row.password);
}

// close the database connection
db.close((err) => {
  //if there is an error closing the database
  if (err) {
    //throw an error in the console
    return console.error(err.message);
  }
  //otherwise send a message that the database is closed
  console.log('Close the database connection.');
});
