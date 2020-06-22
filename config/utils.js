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
      res.send("Error from connection");
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
      let errors = [];
      if (err) {
        errors.push({ msg: "Failed to update question, try again" });
      }
      if (errors.length > 0) {
        res.render(page, { errors });
      }
    });
};

module.exports = {
  multerDest,
  saveToMongoDB,
  updateMongoDB,
};
