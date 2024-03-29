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
  link: {
    type: String,
  },
  file: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // comments
  comments: [
    {
      commentBody: {
        type: String,
        required: true,
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      commentDate: {
        type: Date,
        default: Date.now,
      },
      commentReply: [
        {
          replyBody: {
            type: String,
            required: true,
          },
          replyUser: {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
          replyDate: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

mongoose.model("posts", PostSchema);
