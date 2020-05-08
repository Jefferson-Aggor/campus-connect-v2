const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// REQUIRE LOGIN
const requireLogin = require("../config/requireLogin");

// MODELS
require("../models/Post");
const Post = mongoose.model("posts");

router.get("/", (req, res) => {
  res.render("index");
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
    });
});
module.exports = router;
