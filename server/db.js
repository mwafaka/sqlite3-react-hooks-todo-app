// db.js

const sqlite3 = require('sqlite3').verbose();

// Create and open the database
const db = new sqlite3.Database('todo.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create the 'tasks' table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      completed BOOLEAN DEFAULT false,
      description TEXT NOT NULL
    )`);
  }
});


module.exports = db;
