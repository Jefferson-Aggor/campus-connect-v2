const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// require models
require("../models/Post");
require("../models/Users");
const Post = mongoose.model("posts");
const Users = mongoose.model("user");

router.post("/user/create-info", (req, res) => {
  const { infoType, room, title, body, file } = req.body;
  // save posts to mongoDB;
  const newPost = {
    infoType,
    relatedTo: room,
    title,
    body,
    user: req.user,
  };

  new Post(newPost)
    .save()
    .then(() => {
      req.flash("success_msg", `Post sent to ${newPost.relatedTo} room `);
      res.redirect("/user/chat-form");
    })
    .catch((err) => console.log(err));
});
// endpoint to get all users
router.get("/users", (req, res) => {
  Users.find({})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});

// endpoint to get all posts
router.get("/posts", (req, res) => {
  Post.find({})
    .then((post) => {
      res.json(post);
    })
    .catch((err) => res.send({ error: err.message }));
});

module.exports = router;
