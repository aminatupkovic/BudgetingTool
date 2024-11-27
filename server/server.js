const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const PORT = process.env.PORT || 8080;


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
    host: "localhost",
    user: "root",
    password: "password",
    database: "budgetingdb",
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

// In your server.js or equivalent entry file for your backend

app.post("/api/create-expense", (req, res) => {
    const { name, amount, budget_id, user_id} = req.body; // Ensure that the form data is being sent
    const query = "INSERT INTO expenses (name, amount, budget_id, user_id) VALUES (?, ?, ?, ?)";
    db.query(query, [name, amount, budget_id, user_id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ message: "Expense created successfully" });
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


app.listen(PORT, () => {
  console.log("Server started on port 8080");
});
