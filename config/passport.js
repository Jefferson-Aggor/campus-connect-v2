const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// load the user model
require("../models/Users");
const User = mongoose.model("user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User not found" });
            }

            //   compare password
            bcrypt.compare(password, user.password, (err, match) => {
              if (err) throw err;
              if (match) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect password" });
              }
            });
          })

          .catch((err) => {
            res.send("error from passport");
          });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
