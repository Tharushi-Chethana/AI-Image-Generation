const express = require("express");
const mysql = require("mysql2");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const app = express();
const { v4: uuid } = require("uuid"); // Import uuid

// Setup middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); // Allow only localhost:3000
app.use("/backend/generated_images",express.static(path.join(__dirname, "generated_images"))); // Serve static images

const PORT = 5000;

// MySQL setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "1234", // Your MySQL password
  database: "imageGen",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});

// Function to call Python script (image generation)
async function generateImageWithProgress(userInput, taskId) {
  try {
    tasks.get(taskId).progress = 10; // Update progress (10%)

    const expandedText = await axios.post("http://localhost:5001/expand", { userInput });
    tasks.get(taskId).progress = 50; // Update progress (50%)

    const imagePath = await axios.post("http://localhost:5001/generate-image", {
      expandedText: expandedText.data,
    });
    tasks.get(taskId).progress = 100; // Update progress (100%)

    // Save image path and clean up task
    db.query("INSERT INTO images (path) VALUES (?)", [imagePath.data]);
    tasks.get(taskId).imageUrl = `/backend/generated_images/${path.basename(imagePath.data)}`;
  } catch (error) {
    console.error("Error generating image:", error);
    tasks.delete(taskId);
  }
}

// Routes
app.post("/generate", async (req, res) => {
  try {
    const { userInput } = req.body;
    const imagePath = await generateImage(userInput);

    // Insert image path into MySQL database
    db.query("INSERT INTO images (path) VALUES (?)", [imagePath], (err, result) => {
      if (err) {
        console.error("Error inserting into MySQL:", err);
        return res.status(500).send("Error saving image");
      }

      res.json({ imageUrl: `/backend/generated_images/${path.basename(imagePath)}` });
    });
  } catch (error) {
    console.error("Error in /generate:", error);
    res.status(500).send("Error generating image");
  }
});

app.get("/images", (req, res) => {
  db.query("SELECT path FROM images ORDER BY created_at DESC", (err, results) => {
    if (err) {
      console.error("Error fetching images:", err);
      return res.status(500).send("Error fetching images");
    }
    res.json(
      results.map((row) => `/backend/generated_images/${path.basename(row.path)}`)
    );
  });
});

const tasks = new Map(); // In-memory task store for simplicity

app.post("/start-generation", async (req, res) => {
  try {
    const { userInput } = req.body;
    const taskId = uuid(); // Generate unique task ID
    tasks.set(taskId, { progress: 0 });

    // Trigger async generation (example function)
    generateImageWithProgress(userInput, taskId);

    res.json({ taskId });
  } catch (error) {
    console.error("Error starting generation:", error);
    res.status(500).send("Error starting image generation");
  }
});

app.get("/progress/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const task = tasks.get(taskId);

  if (!task) {
    return res.status(404).send("Task not found");
  }

  res.json(task);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});