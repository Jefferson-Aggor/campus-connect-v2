const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// require files
const { mongURI, cloud_name, api_secret, api_key } = require("../config/keys");
const { multerDest, saveToMongoDB, updateMongoDB } = require("../config/utils");

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

// require models
require("../models/Post");
require("../models/Users");
require("../models/Questions");
require("../models/Chat");
const Post = mongoose.model("posts");
const Users = mongoose.model("user");
const Questions = mongoose.model("question");
const Chats = mongoose.model("chat");

const eagerOptions = {
  quality: 60,
};

router.post(
  "/user/create-info",
  multerDest("./uploads").single("file"),
  (req, res) => {
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
      cloudinary.uploader.upload(
        req.file.path,
        { eager: eagerOptions },
        (err, result) => {
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
                req.flash(
                  "success_msg",
                  `Post sent to ${newPost.relatedTo} room `
                );
                console.log(newPost);
                res.redirect("/user/chat-form");
              })
              .catch((err) => console.log(err));
          }
        }
      );
    }
  }
);

// post route to comments
router.post("/post/comment/:_id", (req, res) => {
  Post.findOne({ _id: req.params._id }).then((post) => {
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

// Reply comments router.
router.post("/posts/comment/reply/:_id", (req, res) => {
  Post.findOne({ _id: req.params._id }).then((post) => {
    const newReply = {
      replyBody: req.body.replyBody,
      replyUser: req.user,
    };
    post.comments.commentReply.unshift(newReply);

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

// router to post questions;
router.post(
  "/questions",
  multerDest("./questions").single("file"),
  (req, res) => {
    const { topic, body } = req.body;
    const { programme, firstname, lastname, _id } = req.user;
    if (!req.file) {
      const newQuestion = {
        topic,
        body,
        user: req.user._id,
        relatedTo: req.user.programme,
      };
      saveToMongoDB(
        Questions,
        newQuestion,
        res,
        `/chat-room/${programme}/?username=${firstname}${lastname}&id=${_id}&room=${programme}`
      );
    } else {
      console.log(req.file);
      cloudinary.uploader.upload(
        req.file.path,
        { eager: eagerOptions },
        (err, result) => {
          if (err) {
            res.send(err);
          } else {
            const newQuestion = {
              topic,
              body,
              user: req.user._id,
              relatedTo: req.user.programme,
              file: result.secure_url,
            };
            saveToMongoDB(
              Questions,
              newQuestion,
              res,
              `/chat-room/${programme}/?username=${firstname}${lastname}&id=${_id}&room=${programme}`
            );
          }
        }
      );
    }
  }
);

// route to edit a question
router.put(
  "/question/edit/:_id",
  multerDest("/questions/edited").single("file"),
  (req, res) => {
    Questions.findOne({ _id: req.params._id }).then((question) => {
      if (req.file) {
        cloudinary.uploader.upload(
          req.file.path,
          eagerOptions,
          (err, result) => {
            if (err) throw err.message;
            question.file = result.secure_url;
            updateMongoDB(
              question,
              req.flash("success_msg", "Question updated"),
              res,
              `/questions/${question._id}`,
              "questions/edit-question"
            );
          }
        );
      } else {
        question.body = req.body.editquestion;
        updateMongoDB(
          question,
          req.flash("success_msg", "Question updated"),
          res,
          `/questions/${question._id}`,
          "questions/edit-question"
        );
      }
    });
  }
);

router.delete("/question/delete/:_id", (req, res) => {
  Questions.deleteOne({ _id: req.params._id }).then((question) => {
    let { firstname, lastname, _id, programme } = req.user;
    if (question.user._id === req.user._id) {
      req.flash("success_msg", "Question Deleted");
      res.redirect(
        `/chat-room/${programme}?username=${firstname}${lastname}&id=${_id}&room=${programme}`
      );
    } else {
      req.flash("error_msg", "Not Authorized action");
      res.redirect(`/questions/${question._id}`);
    }
  });
});

// router to post answers to questions
router.post(
  "/question/:_id",
  multerDest("./questions/solved-question").single("file"),
  (req, res) => {
    Questions.findOne({ _id: req.params._id }).then((question) => {
      if (!req.file) {
        const newQuestion = {
          solvedBy: req.user._id,
          solution: req.body.solution,
        };
        question.solutions.unshift(newQuestion);

        question
          .save()
          .then((newQuestion) => {
            console.log(newQuestion);
            req.flash("success_msg", "Answer Submitted");
            res.redirect(`/questions/${question._id}`);
          })
          .catch((err) => res.send(err));
      } else {
        cloudinary.uploader.upload(
          req.file.path,
          eagerOptions,
          (err, result) => {
            const newQuestion = {
              solvedBy: req.user._id,
              solution: req.body.solution,
              file: result.secure_url,
            };
            question.solutions.unshift(newQuestion);

            question
              .save()
              .then((newQuestion) => {
                console.log(newQuestion);
                req.flash("success_msg", "Answer Submitted");
                res.redirect(`/questions/${question._id}`);
              })
              .catch((err) => res.send(err));
          }
        );
      }
    });
  }
);

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

// Get all posts related to a programme.
router.get("/posts/:relatedTo", (req, res) => {
  Post.find({ relatedTo: req.params.relatedTo })
    .populate("user")
    .sort({ _id: -1 })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.send({ error: err.message });
    });
});

// Get a single post;
router.get("/posts/:_id", (req, res) => {
  Post.findOne({ _id: req.params._id })
    .populate("user")
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      res.send({ error: err.message });
    });
});

// get all questions;
router.get("/questions", (req, res) => {
  Questions.find({})
    .populate("user")
    .sort({ _id: -1 })
    .then((questions) => {
      res.json(questions);
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});
// get a questions related to a room;
router.get("/questions/:programme", (req, res) => {
  Questions.find({ relatedTo: req.params.programme })
    .populate("user")
    .populate("solutions.solvedBy")
    .limit(15)
    .sort({ _id: -1 })
    .then((questions) => {
      if (questions) {
        res.json(questions);
      } else {
        res.json({ msg: "No questions yet" });
      }
    })
    .catch((err) => {
      res.json({ error: err.message });
    });
});

// get a single question;
router.get("/question/:_id", (req, res) => {
  Questions.findOne({ _id: req.params._id })
    .then((question) => {
      res.json(question);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// get all chats related to a room.
router.get("/chats/:room", (req, res) => {
  Chats.find({ room: req.params.room })
    .sort({ _id: -1 })
    .then((chat) => {
      if (chat === []) {
        res.json({ msg: "No message yet" });
      } else {
        res.json(chat);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
