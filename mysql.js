let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'sql2.freesqldatabase.com',
    user: 'sql2312807',
    password: 'yB7%iC5*',
    database: 'sql2312807'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});
