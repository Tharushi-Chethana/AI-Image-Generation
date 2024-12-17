const express = require("express");
const mysql = require("mysql2");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
const app = express();

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
async function generateImage(userInput) {
  const response = await axios.post("http://localhost:5001/generate", { userInput });
  return response.data.imagePath; // Assuming Python script returns a path
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});