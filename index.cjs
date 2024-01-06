const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const saltRounds = 10;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/regreen")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });


// Define MongoDB schema and model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

// Get all users
app.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        res.json({ status: "success", user: { username: user.username, email: user.email } });
      }  else {
        res.status(401).json({ error: "Incorrect password" });
      }
    }  else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Signup route
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/signup", upload.single("profilePicture"), async (req, res,next) => {
  const { username, email, password, confirmpassword } = req.body;
  
  try {
    if (password !== confirmpassword) {
      throw new Error("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = {
      username: username,
      email: email,
      password: hashedPassword,
      confirmpassword: confirmpassword,
      profilePicture: req.file ? req.file.filename : null,
    };

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    } else {
      await User.create(data);
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (e) {
    console.error(e);

    // Check for specific error messages
    if (e.message.includes("User already exists")) {
      return res.status(409).json({ error: e.message });
    }

    if (e.message.includes("Confirmation password is required")) {
      return res.status(400).json({ error: e.message });
    }

    // Handle other errors or return a generic error response
    res.status(500).json({ error: "Internal Server Error", details: e.message });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});
// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason.stack || reason);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
