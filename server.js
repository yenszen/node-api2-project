const express = require("express");
const postsRouter = require("./posts/postsRouter");

const server = express();

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
  <h2>Node API 2 project</h2>
  <p>Get started!</p>
  `);
});

module.exports = server;
