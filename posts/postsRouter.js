const express = require("express");
const posts = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  posts
    .find()
    .then(allPosts => {
      res.status(200).json(allPosts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" })
    );
});

router.get("/:id/comments", (req, res) => {
  posts
    .findPostComments(req.params.id)
    .then(postComment => {
      if (postComment) {
        res.status(200).json(postComment);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  posts
    .insert(req.body)
    .then(newPost => {
      res.status(201).json(newPost);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.delete("/:id", (req, res) => {
  posts
    .remove(req.params.id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json({ message: "The post has been removed" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed." });
    });
});

module.exports = router;
