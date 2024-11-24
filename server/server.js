const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// Create express app
const app = express();
app.use(express.json());

// CORS options
const corsOptions = {
  origin: ["http://localhost:5173"], // React dev server
};
app.use(cors(corsOptions));

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

// Routes

// Create User
app.post("/api/create-user", (req, res) => {
  const { userName } = req.body;
  const query = "INSERT INTO users (name) VALUES (?)";
  db.query(query, [userName], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "User created successfully", userId: results.insertId });
  });
});

// Create Budget
app.post("/api/create-budget", (req, res) => {
  const { name, amount, userId } = req.body;
  const query = "INSERT INTO budgets (name, amount, userId) VALUES (?, ?, ?)";
  db.query(query, [name, amount, userId], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ message: "Budget created successfully" });
  });
});

// Get User's Budgets
app.get("/api/budgets/:userId", (req, res) => {
  const { userId } = req.params;
  const query = "SELECT * FROM budgets WHERE userId = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});