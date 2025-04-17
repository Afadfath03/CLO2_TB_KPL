const express = require("express");
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tubes_task_management",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected successfully!");
        connection.release();
    }
});

const languageMiddleware = require("./middleware/languageMiddleware");
app.use(languageMiddleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak valid' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err); // Debug error
            return res.status(403).json({ message: 'Token tidak valid' });
        }
        console.log("Decoded token:", user); // Debug decoded token
        req.user = user;
        next();
    });
}

function isAdmin(req, res, next) {
    if (req.user.role !== 0) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
}

function isUser(req, res, next) {
    if (req.user.role !== 1) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
}

app.post("/api/login", async (req, res) => {
    const { emailOrUsername, password } = req.body;
    try {
        console.log("Login attempt:", emailOrUsername, password); // Debug input
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE (email = ? OR name = ?) AND password = ?",
            [emailOrUsername, emailOrUsername, password]
        );
        console.log("Query result:", rows); // Debug query result

        if (rows.length === 0) {
            return res.status(401).json({ error: "Username atau Email atau Password salah" });
        }

        const user = rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err); // Debug error
        res.status(500).json({ error: "Failed to login" });
    }
});


// Task
app.get("/api/tasks", async (req, res) => {
    try {
        const [tasks] = await pool.query("SELECT * FROM tasks ORDER BY status ASC");
        res.json(tasks);
    } catch (err) {
        console.error("Failed to fetch tasks:", err);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.post("/api/tasks", async (req, res) => {
    const { name, deadline } = req.body;

    if (!name || !deadline) {
        return res.status(400).json({ error: "Task name and deadline are required" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO tasks (name, deadline, status) VALUES (?, ?, 0)", // Status default 0 (unfinished)
            [name, deadline]
        );
        res.status(201).json({ id: result.insertId, name, deadline, status: 0 });
    } catch (err) {
        console.error("Failed to create task:", err);
        res.status(500).json({ error: "Failed to create task" });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ error: "Invalid status value. Must be 0 or 1." });
    }

    try {
        const [result] = await pool.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task status updated successfully", taskId: id, newStatus: status });
    } catch (err) {
        console.error("Failed to update task status:", err);
        res.status(500).json({ error: "Failed to update task status" });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

        // Periksa apakah ada baris yang dihapus
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully", taskId: id });
    } catch (err) {
        console.error("Failed to delete task:", err);
        res.status(500).json({ error: "Failed to delete task" });
    }
});


// konstruksi tabel role
const roleActionsTable = {
    0: { // Admin role
        dashboard: "admin.html",
        actions: {
            viewUsers: async (req, res) => {
                const [rows] = await pool.query("SELECT id, name, email, role FROM users");
                res.json(rows);
            },
            createUser: async (req, res) => {
                const { name, email, password, role } = req.body;
                await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, password, role]);
                res.status(201).json({ status: "User created" });
            },
            updateUser: async (req, res) => {
                const { id } = req.params;
                const { name, email, password, role } = req.body;
                await pool.query("UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?", [name, email, password, role, id]);
                res.json({ status: "User updated" });
            },
            deleteUser: async (req, res) => {
                const { id } = req.params;
                await pool.query("DELETE FROM users WHERE id = ?", [id]);
                res.json({ status: "User deleted" });
            }
        }
    },
    1: { // User role
        dashboard: "user.html",
        actions: {
            viewProfile: async (req, res) => {
                const [rows] = await pool.query(
                    "SELECT name, email, password FROM users WHERE id = ? AND role = 1",
                    [req.user.id]
                );

                if (rows.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }

                res.json(rows[0]);
            },
            updateProfile: async (req, res) => {
                const { name, email, password } = req.body;
                await pool.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, req.user.id]);
                res.json({ status: "Profile updated" });
            }
        }
    }
};

app.get("/api/users/:id", authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error("Failed to fetch user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// Admin
app.get("/api/users", authenticateToken, isAdmin, roleActionsTable[0].actions.viewUsers);
app.post("/api/users", authenticateToken, isAdmin, roleActionsTable[0].actions.createUser);
app.put("/api/users/:id", authenticateToken, isAdmin, roleActionsTable[0].actions.updateUser);
app.delete("/api/users/:id", authenticateToken, isAdmin, roleActionsTable[0].actions.deleteUser);

// User
app.get("/api/me", authenticateToken, isUser, roleActionsTable[1].actions.viewProfile);
app.put("/api/me", authenticateToken, isUser, roleActionsTable[1].actions.updateProfile);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});