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
router.get("/questions/:_id", requireLogin, (req, res) => {
  Questions.findOne({ _id: req.params._id })
    .populate("user")
    .populate("solutions.solvedBy")
    .then((question) => {
      res.render("questions/solve-question", {
        question,
        loggedUser: req.user,
      });
    })
    .catch((err) => {
      res.send({ error: err.message });
    });
});

//Route to edit a question
router.get("/question/edit/:_id", requireLogin, (req, res) => {
  Questions.findOne({ _id: req.params._id })
    .then((question) => {
      if (question.user.toString() != req.user._id.toString()) {
        req.flash("error_msg", "Not authorized action");
        res.redirect(`/questions/${question._id}`);
      } else {
        console.log(question);
        res.render("questions/edit-question", {
          question,
          loggedUser: req.user,
        });
      }
    })
    .catch((err) => console.log("not found"));
});

// private chat route.
router.get("/private-chat", requireLogin, (req, res) => {
  res.render("chats/private-chat");
});

router.get("/post/details/:_id", (req, res) => {
  Post.findOne({ _id: req.params._id })
    .populate("user")
    .populate("comments.commentUser")
    .then((post) => {
      console.log(post);
      res.render("postDetails", { post, loggedUser: req.user });
    })
    .catch((err) => {
      res.send({ err: err.message });
    });
});
module.exports = router;
