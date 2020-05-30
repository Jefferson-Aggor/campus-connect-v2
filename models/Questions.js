const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  topic: {
    type: String,
    required: true,
  },
  body: {
    type: String,
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
  solutions: [
    {
      solvedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      solution: {
        type: String,
      },
      solvedDate: {
        type: Date,
        default: Date.now,
      },
      file: {
        type: String,
      },
    },
  ],
});

mongoose.model("question", QuestionSchema);
