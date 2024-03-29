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
const conditionalString = (value1, value2, options) => {
  if (value1.toString() === value2.toString()) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
const conditionalNum = (value1, value2, options) => {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

const showLiked = (arr, loggedUserId) => {
  if (
    arr.find((liked) => liked.likedBy.toString() === loggedUserId.toString())
  ) {
    return `<i class="far fa-heart text-red like_dislike"></i>`;
  } else {
    return `<i class="far fa-heart like_dislike"></i>`;
  }
};

const showEditMenu = (loggedUserId, userId, editRoute, deleteRoute, id) => {
  if (loggedUserId.toString() === userId.toString()) {
    return `
    <a  href=${editRoute}${id.toString()}>
          <i class="far fa-edit"></i> Edit
    </a>
          
    <form action=${deleteRoute} method="post">
          <input type="hidden" name="_method" value="DELETE">
          <i class="fas fa-delete"></i> Delete
    </form>
    `;
  } else {
    return "";
  }
};

module.exports = {
  formatDate,
  dateFromNow,
  trimText,
  nameStripper,
  commentStripper,
  conditionalString,
  showEditMenu,
  showLiked,
};
