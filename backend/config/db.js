const mysql = require('mysql2');

// Konekcija sa bazom podataka
const connection = mysql.createConnection({
  host: 'localhost',         // Host tvoje baze (može biti localhost ili IP adresa servera)
  user: 'root',         // Korisničko ime za bazu
  password: '', // Lozinka za bazu
  database: 'diplomski' // Naziv tvoje baze
});

// Povezivanje sa bazom
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

module.exports = connection;
