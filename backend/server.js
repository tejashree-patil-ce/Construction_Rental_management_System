import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware: lets Express read JSON sent in the request body
app.use(express.json());

// Route 1: basic check
app.get("/", (req, res) => {
  res.send("Maya Centring Plates API is running");
});

// Route 2: health check that returns JSON
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// Temporary route: to see how req.body works (we'll delete this later)
app.post("/api/test-body", (req, res) => {
  res.json({ success: true, youSent: req.body });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});