const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tubes_task_management",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const languageMiddleware = require("./middleware/languageMiddleware");
app.use(languageMiddleware);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/tasks", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM tasks");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve tasks" });
    }
});

app.post("/api/tasks", async (req, res) => {
    const { name, deadline } = req.body;
    try {
        await pool.query(
            "INSERT INTO tasks (name, deadline) VALUES (?, ?)",
            [name, deadline]
        );
        res.status(201).json({ status: "Task created" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
        res.json({ status: "Task updated" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
        res.json({ status: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
