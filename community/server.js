const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log("Trying to connect with URI:", process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/Community", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Question schema and model
const answerSchema = new mongoose.Schema({
  id: String,
  author: String,
  content: String,
  votes: Number,
  date: String,
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorAvatar: String,
  tags: [String],
  replies: Number,
  likes: Number,
  timeAgo: String,
  answers: [answerSchema],
});

const Question = mongoose.model("Question", questionSchema);

// API Routes
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch questions" });
  }
});

app.post("/api/questions", async (req, res) => {
  const { title, content, author, authorAvatar, tags } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({
      success: false,
      error: "Title, content, and author are required",
    });
  }

  const newQuestion = new Question({
    title,
    content,
    author,
    authorAvatar:
      authorAvatar ||
      author
        .split(" ")
        .map((n) => n[0])
        .join(""),
    tags: tags || [],
    replies: 0,
    likes: 0,
    timeAgo: "Just now",
    answers: [],
  });

  try {
    await newQuestion.save();
    res.status(201).json({ success: true, data: newQuestion });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save question" });
  }
});

app.get("/api/questions/:id", (req, res) => {
  const question = questions.find((q) => q.id === req.params.id);
  if (!question) {
    return res
      .status(404)
      .json({ success: false, error: "Question not found" });
  }
  res.json({ success: true, data: question });
});

app.put("/api/questions/:id", (req, res) => {
  const { action, answerData, answerId } = req.body;
  const questionIndex = questions.findIndex((q) => q.id === req.params.id);

  if (questionIndex === -1) {
    return res
      .status(404)
      .json({ success: false, error: "Question not found" });
  }

  if (action === "addAnswer") {
    const newAnswer = {
      id: Date.now().toString(),
      author: answerData.author,
      content: answerData.content,
      votes: 0,
      date: "Just now",
    };

    questions[questionIndex].answers.push(newAnswer);
    questions[questionIndex].replies++;
  } else if (action === "voteAnswer") {
    const answerIndex = questions[questionIndex].answers.findIndex(
      (a) => a.id === answerId
    );

    if (answerIndex === -1) {
      return res
        .status(404)
        .json({ success: false, error: "Answer not found" });
    }

    const voteChange = req.body.voteType === "up" ? 1 : -1;
    questions[questionIndex].answers[answerIndex].votes = Math.max(
      0,
      questions[questionIndex].answers[answerIndex].votes + voteChange
    );
  }

  res.json({ success: true, data: questions[questionIndex] });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/questions`);
  console.log(`🌐 Open your browser to http://localhost:${PORT}`);
});
