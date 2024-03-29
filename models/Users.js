const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  programme: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: { type: Schema.Types.ObjectId, ref: "posts" },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("user", UserSchema);
