const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// require files
const { mongURI, cloud_name, api_secret, api_key } = require("../config/keys");

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

// require models
require("../models/Post");
require("../models/Users");
const Post = mongoose.model("posts");
const Users = mongoose.model("user");

// multer config;
const up = multer({
  dest: "./uploads",
});

const eagerOptions = {
  q: 60,
};

router.post("/user/create-info", up.single("file"), (req, res) => {
  const { infoType, room, title, body, link } = req.body;

  // check to see if there's a file

  if (!req.file) {
    const newPost = {
      infoType,
      relatedTo: room,
      title,
      body,
      link,
      user: req.user,
    };

    new Post(newPost)
      .save()
      .then(() => {
        req.flash("success_msg", `Post sent to ${newPost.relatedTo} room `);
        res.redirect("/user/chat-form");
      })
      .catch((err) => console.log(err));
  } else {
    console.log(req.file);
    cloudinary.uploader.upload(req.file.path, eagerOptions, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const newPost = {
          infoType,
          relatedTo: room,
          title,
          body,
          link,
          file: result.secure_url,
          user: req.user,
        };
        new Post(newPost)
          .save()
          .then(() => {
            req.flash("success_msg", `Post sent to ${newPost.relatedTo} room `);
            console.log(newPost);
            res.redirect("/user/chat-form");
          })
          .catch((err) => console.log(err));
      }
    });
  }
});

// post route to comments
router.post("/post/comment/:_id", (req, res) => {
  Post.findOne({ _id: req.params._id })
    .populate("user")
    .then((post) => {
      // create comment;
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user,
      };
      post.comments.unshift(newComment);

      post
        .save()
        .then((newPost) => {
          console.log(newPost);
          res.redirect(`/post/details/${post._id}`);
        })
        .catch((err) => {
          res.send({ err: err.message });
        });
    });
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
    .populate("user")
    .then((post) => {
      res.json(post);
    })
    .catch((err) => res.send({ error: err.message }));
});

module.exports = router;
