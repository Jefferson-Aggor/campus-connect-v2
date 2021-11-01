const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// REQUIRE LOGIN
const requireLogin = require("../config/requireLogin");

// REQUIRE likes and dislikes file
const { checkIfLiked } = require("../utils/likes-and-dislikes");

// MODELS
require("../models/Post");
require("../models/Questions");
const Post = mongoose.model("posts");
const Questions = mongoose.model("question");

module.exports = function (io) {
  router.get("/", (req, res) => {
    res.render("index");
  });
  // get a single question

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
        res.render("error", { message: "Something bad happened, try again" });
      });
  });

  // get likes
  io.on("connection", (socket) => {
    console.log("socket connection made");
    socket.on("liked", (likes, id, loggedUserId) => {
      let like = likes + 1;
      Questions.findOne({ _id: id }).then((question) => {
        if (checkIfLiked(question.likes, loggedUserId)) {
          socket.emit("like", { liked: true, message: "already liked" });
        } else {
          const newLike = {
            likedBy: loggedUserId,
          };
          question.likes.push(newLike);
          question
            .save()
            .then((likedQuestion) => {
              console.log(likedQuestion);
              socket.emit("like", { liked: false, message: like });
            })
            .catch((err) => console.log(err.message));
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
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
      .catch((err) => {
        res.render("error", {
          message: "Question not found",
        });
      });
  });

  // private chat route.
  router.get("/private-chat", requireLogin, (req, res) => {
    res.render("chats/private-chat");
  });

  // Get post details
  router.get("/post/details/:_id", (req, res) => {
    Post.findOne({ _id: req.params._id })
      .populate("user")
      .populate("comments.commentUser")
      .then((post) => {
        console.log(post);
        res.render("postDetails", { post, loggedUser: req.user });
      })
      .catch((err) => {
        res.render("error", { message: "Sorry, cannot get post. Try again" });
      });
  });
  return router;
};
