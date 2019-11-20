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




//should only return first row of Users table
let sqlquery = 'Select * FROM Users';

databasetest.get(sqlquery, (err, row)) => {
  if (err){
    return console.error(err.message);
  }
  return row
    ? console.log(row.username, row.surname, row.firstName, row.email, row.password);
}

// should return every row from the SpaceShip table
let sqlquery2 = `SELECT * FROM SpaceShip`;

db.each(sqlquery2, (err, row) => {
  if (err) {
    throw err;
  }
  console.log(`${row.shipName} ${row.captain} ${row.mainColour} ${row.secondColour}`);
});




//insert a new user into the Users table
let newUser = ['insert', 'insertsname', 'insertfname', 'insert@hw.ac.uk', 'insert'];

// construct the insert statement with multiple placeholders
// based on the number of rows
let placeholders = databasetest.map((newUser) => '(?)').join(',');
let sqlinsert = 'INSERT INTO Users(name) VALUES ' + placeholders;

// output the INSERT statement
console.log(sqlinsert);

db.run(sqlinsert, newUser, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Rows inserted ${this.changes}`);
});



//Update a user in users table
let updatedata = ['752CJA', 'AJC257'];
let sqlupdate = `UPDATE Users
            SET username = ?
            WHERE username = ?`;

db.run(sqlupdate, updatedata, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) updated: ${this.changes}`);

});



//delete a user from the Users table
let deleteduser = 'Example';
// delete a row based on id
db.run(`DELETE FROM Users WHERE username = ?`, deleteduser, function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Row(s) deleted ${this.changes}`);
});



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
