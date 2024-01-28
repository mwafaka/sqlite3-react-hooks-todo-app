// app.js

const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));
// Add a new task to the 'tasks' table
app.post('/tasks', (req, res) => {

    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required.' });
    }

    db.run('INSERT INTO tasks (description) VALUES(?)', description, function (err) {
        if (err) {
            console.error('Error inserting task:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        return res.status(201).json({ id: this.lastID, description: description ,completet:false});
    });
});

// Get all tasks from the 'tasks' table
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            console.error('Error retrieving tasks:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        console.log(rows);
        return res.json(rows);
    });
});

// PUT endpoint to update a specific task
app.put('/tasks/:id', (req, res) => {

    const { id } = req.params;

    // Assuming you have a 'tasks' table with columns like 'id', 'title', 'description', etc.
    const updateQuery = `
    UPDATE tasks
    SET id = ?
    WHERE id = ?
    `;

    db.run(updateQuery, [id, id], function (err) {
        if (err) {
            console.error('Error updating task:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        // Check if a row was affected
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        return res.json({ message: 'Task updated successfully.' });
    });
});

// Delete a task from the 'tasks' table
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM tasks WHERE id = ?', id, function (err) {
        if (err) {
            console.error('Error deleting task:', err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        return res.json({ message: 'Task deleted successfully.' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

