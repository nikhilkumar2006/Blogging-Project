const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

let posts = [];

// Get all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Create new post
app.post("/posts", (req, res) => {
  let newPost = { title: req.body.title, content: req.body.content, comments: [] };
  posts.push(newPost);
  res.json({ message: "Post created!", post: newPost });
});

// Add comment
app.post("/posts/:id/comment", (req, res) => {
  let postId = req.params.id;
  if (posts[postId]) {
    posts[postId].comments.push(req.body.comment);
    res.json({ message: "Comment added!" });
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
