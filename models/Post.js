const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  infoType: {
    type: String,
    required: true,
  },
  relatedTo: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  file: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

mongoose.model("posts", PostSchema);
