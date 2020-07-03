const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const router = express.Router();

// require models
require("../models/Users");
require("../models/Post");
const User = mongoose.model("user");
const Post = mongoose.model("posts");

const requireLogin = require("../config/requireLogin");

router.get("/register", (req, res) => {
  res.render("register");
});

// chat form
router.get("/chat-form", requireLogin, (req, res) => {
  res.render("chats/chatForm", { user: req.user });
});

// register user to db
router.post("/register", (req, res) => {
  const { firstname, lastname, school, programme, email, password } = req.body;
  let errors = [];
  if (req.body.password.length < 6) {
    errors.push({ msg: "Invalid Password.." });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstname,
      lastname,
      school,
      programme,
      email,
      password,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        errors.push({ msg: "User already exists. Check email" });
        res.render("register", {
          errors,
          firstname,
          lastname,
          school,
          programme,
          password,
          email,
        });
      } else {
        const newUser = {
          firstname,
          lastname,
          school,
          programme,
          email,
          password,
        };
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;

            new User(newUser)
              .save()
              .then(() => {
                req.flash(
                  "success_msg",
                  "Successfully created account. Login now"
                );
                res.redirect("/");
              })
              .catch((err) => {
                errors.push({ msg: err.name });
                res.render("register", { errors });
              });
          });
        });
      }
    });
  }
});

// user edit profile;
router.put("/edit/:_id", (req, res) => {
  const { firstname, lastname, school, programme } = req.body;

  User.findOne({ _id: req.params._id }).then((user) => {
    (user.firstname = firstname),
      (user.lastname = lastname),
      (user.school = school),
      (user.programme = programme);

    user.save().then((user) => {
      console.log(user);
      req.flash("success_msg", "Profile Updated");
      res.redirect(
        `/chat-room/${user.programme}?username=${user.firstname}${user.lastname}&room=${user.programme}&id=${user._id}`
      );
    });
  });
});

// delete user;
router.delete("/delete/:_id", (req, res) => {
  const { confirmDelete, deleteValue } = req.body;
  let errors = [];
  if (confirmDelete !== deleteValue) {
    console.log("values do not match");
    errors.push({ msg: `values do not match ` });
  } else {
    User.deleteOne({ _id: req.params._id }).then(() => {
      console.log("User account deleted");
      req.flash("success_msg", "User account deleted");
      res.redirect("/");
    });
  }

  console.log(req.body);
});

// user login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/user/chat-form",
    failureFlash: true,
  })(req, res, next);
});

// user logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You've successfully logged out.");
  res.redirect("/");
});

module.exports = router;
