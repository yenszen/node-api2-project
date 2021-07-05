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
      if (post.length > 0) {
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
      if (postComment.length > 0) {
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
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
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
  }
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  posts
    .update(id, changes)
    .then(post => {
      if (post === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else if (!changes.title || !changes.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
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

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;

  posts
    .findById(id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }

      req.body.post_id = id;

      posts
        .insertComment(req.body)
        .then(comment => {
          // console.log(req.body);
          res.status(201).json(comment);
        })
        .catch(err => {
          // console.log(req.body);
          res.status(400).json({
            errorMessage: "Please provide text for the comment."
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database."
      });
    });
});

module.exports = router;
