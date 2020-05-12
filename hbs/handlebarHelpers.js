const moment = require("moment");

const formatDate = (date) => {
  return moment(date).format("ddd MMM YYYY hh:mm a");
};

const dateFromNow = (date) => {
  return moment(date).fromNow();
};

const trimText = (text) => {
  if (text.length > 100) {
    return text.substring(0, 100) + "...";
  } else {
    return text;
  }
};

const nameStripper = (firstname) => {
  const splitFirstname = firstname.split("");
  return splitFirstname[0];
};

const commentStripper = (comment) => {
  if (comment.length === 0) {
    console.log("no comment yet");
  } else if (comment.length === 1) {
    return comment[0];
  } else {
    return {
      firstComment: comment[0],
      secondComment: comment[1],
    };
  }
};
module.exports = {
  formatDate,
  dateFromNow,
  trimText,
  nameStripper,
  commentStripper,
};
