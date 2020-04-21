const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  room: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  userID: {
    type: String,
  },
  message: {
    type: String,
  },
  msgType: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("chat", ChatSchema);
