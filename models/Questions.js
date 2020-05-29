const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  relatedTo: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  askedTime: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("question", QuestionSchema);
