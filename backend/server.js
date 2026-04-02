// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connectDB = require("./db");
const Task = require("./models/Task");
const User = require("./models/User");
const { authMiddleware } = require("./middleware/auth");

dotenv.config();

const app = express();

// =================== PRODUCTION CORS SETUP ===================
const allowedOrigins = [
  "https://wafer-technology-assignment-3.onrender.com" // your frontend URL
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman) or from allowed origins
    if(!origin || allowedOrigins.indexOf(origin) !== -1){
      callback(null, true);
    } else {
      callback(new Error("CORS policy: Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

// =================== MIDDLEWARE ===================
app.use(express.json());

// =================== ENV & PORT ===================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("❌ MONGO_URI or JWT_SECRET not defined in .env");
  process.exit(1);
}

// Connect to MongoDB
connectDB(MONGO_URI);

// =================== TASK ROUTES ===================

// GET all tasks for logged-in user
app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new task
app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "Incomplete",
      user: req.user.id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(400).json({ message: "Error creating task", error: err.message });
  }
});

// UPDATE task
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(400).json({ message: "Error updating task" });
  }
});

// DELETE task
app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(400).json({ message: "Error deleting task" });
  }
});

// =================== AUTH ROUTES ===================

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Register error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
});

// =================== START SERVER ===================
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));