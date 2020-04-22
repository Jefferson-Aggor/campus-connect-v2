const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

const { cloud_name, api_key, api_secret } = require("../config/keys");
const { formatMessage } = require("../utils/formatMessage");
const { joinUser, getUser, userLeave } = require("../utils/chat-user");

// require chat model
require("../models/Chat");
const Chat = mongoose.model("chat");

// init cloudinary
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

module.exports = function (io) {
  router.get("/", (req, res) => {
    res.render("chats/chatroom");
  });

  io.on("connection", (socket) => {
    console.log("connected");

    // join chat
    socket.on("join-chat", (details) => {
      const user = joinUser(socket.id, details.name, details.room);
      socket.join(user.room);
      // load messages from mongoDB;
      Chat.find({ room: user.room })
        .then((message) => {
          console.log("messages loaded");
          socket.emit("prev-messages", message);
          socket.emit(
            "chatbot-messages",
            formatMessage("", "Welcome to campus connect chat")
          );
        })
        .catch((err) => {
          console.log(err);
        });

      // chatbot messages

      socket.broadcast
        .to(user.room)
        .emit("chatbot-messages", `${user.username} joined`);
    });

    // client messages
    socket.on("text-message", (msg, urlDetails) => {
      const newMessage = {
        room: urlDetails.room,
        username: urlDetails.name,
        userID: urlDetails.id,
        message: msg,
        msgType: "text",
      };

      new Chat(newMessage)
        .save()
        .then(() => {
          console.log(newMessage);
        })
        .catch((err) => {
          console.log(err);
        });
      io.to(urlDetails.room).emit(
        "text-messages",
        formatMessage(urlDetails.name, msg),
        urlDetails
      );
    });

    socket.on("image", (image) => {
      const user = getUser(socket.id);
      cloudinary.uploader.upload(image.fileEnctype, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          const newMessage = {
            room: user.room,
            username: user.username,
            userID: image.userId,
            message: result.secure_url,
            msgType: "image",
          };

          new Chat(newMessage)
            .save()
            .then(() => {
              console.log(newMessage);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
      io.to(user.room).emit(
        "image-from-server",
        formatMessage(user.username, ""),
        image
      );
    });
    socket.on("video", (video) => {
      const user = getUser(socket.id);
      cloudinary.uploader.upload_large(
        video.fileEnctype,
        { resource_type: "video", chunk_size: 100000 },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const newMessage = {
              room: user.room,
              username: user.username,
              userID: video.userId,
              message: result.secure_url,
              msgType: "video",
            };
            new Chat(newMessage)
              .save()
              .then(() => {
                console.log(newMessage);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      );
      io.to(user.room).emit(
        "video-from-server",
        formatMessage(user.username, ""),
        video
      );
    });
    socket.on("audio", (audio) => {
      const user = getUser(socket.id);
      cloudinary.uploader.upload_large(
        audio.fileEnctype,
        { resource_type: "video", chunk_size: 100000 },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const newMessage = {
              room: user.room,
              username: user.username,
              userID: audio.userId,
              message: result.secure_url,
              msgType: "audio",
            };
            new Chat(newMessage)
              .save()
              .then(() => {
                console.log(newMessage);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      );
      io.to(user.room).emit(
        "audio-from-server",
        formatMessage(user.username, ""),
        audio
      );
    });
    socket.on("pdf", (pdf) => {
      const user = getUser(socket.id);
      cloudinary.uploader.upload(
        pdf.fileEnctype,
        { resource_type: "video", flags: "attachment" },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const newMessage = {
              room: user.room,
              username: user.username,
              userID: pdf.userId,
              message: result.secure_url,
              msgType: "pdf",
            };
            new Chat(newMessage)
              .save()
              .then(() => {
                console.log(newMessage);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      );
      io.to(user.room).emit(
        "pdf-from-server",
        formatMessage(user.username, ""),
        pdf
      );
    });

    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit("chatbot-messages", `${user.username} left`);
      }
    });
  });

  return router;
};
