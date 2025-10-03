const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",       // <-- change this if your MySQL has a password
  database: "ecommerce",  // <-- change database name here if needed
});

// REGISTER USER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN USER
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM login WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Example: Get all users (for testing)
app.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email FROM user");
    res.status(200).json({ data: rows });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Example existing routes
app.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.description,
        pi.image_url AS category_image
      FROM categories c
      LEFT JOIN products p 
        ON p.category_id = c.id
      LEFT JOIN product_images pi 
        ON pi.product_id = p.id AND pi.is_primary = 1
      GROUP BY c.id;
    `);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM products`);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
