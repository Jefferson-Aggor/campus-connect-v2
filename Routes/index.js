const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// REQUIRE LOGIN
const requireLogin = require("../config/requireLogin");

// MODELS
require("../models/Post");
require("../models/Questions");
const Post = mongoose.model("posts");
const Questions = mongoose.model("question");

router.get("/", (req, res) => {
  res.render("index");
});

// Get solution to questions
router.get("/questions/:_id", (req, res) => {
  Questions.findOne({ _id: req.params._id })
    .populate("user")
    .sort({ _id: -1 })
    .then((question) => {
      res.render("solve-question", { question });
    })
    .catch((err) => {
      res.send({ error: err.message });
    });
});

// private chat route.
router.get("/private-chat", requireLogin, (req, res) => {
  res.render("chats/private-chat");
});

router.get("/post/details/:_id", (req, res) => {
  Post.findOne({ _id: req.params._id })
    .populate("user")
    .then((post) => {
      res.render("postDetails", { post, loggedUser: req.user });
    })
    .catch((err) => {
      res.send({ err: err.message });
    });
});
module.exports = router;
