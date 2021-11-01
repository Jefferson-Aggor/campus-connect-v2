const multer = require("multer");

// multer function
const multerDest = (destination) => {
  return multer({
    dest: destination,
  });
};

// Save to DB
const saveToMongoDB = (schema, objectToSave, res, url) => {
  return new schema(objectToSave)
    .save()
    .then((item) => {
      res.redirect(url);
    })
    .catch((err) => {
      res.render("error", {
        message: "Something bad happened, Please try again",
      });
    });
};

const updateMongoDB = (schema, flash, res, url, page) => {
  return schema
    .save()
    .then((item) => {
      console.log(item);
      flash;
      res.redirect(url);
    })
    .catch((err) => {
      res.render("error", {
        message: "Something bad happened. Please try again",
      });
    });
};

module.exports = {
  multerDest,
  saveToMongoDB,
  updateMongoDB,
};
