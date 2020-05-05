const ensureLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please Login first");
  res.redirect("/");
};

module.exports = ensureLoggedIn;
