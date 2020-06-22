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
const conditional = (value1, value2, options) => {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};

const showEditMenu = (loggedUserId, userId, questionId) => {
  if (loggedUserId.toString() === userId.toString()) {
    return `<a class=" dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference" data-toggle="dropdown" aria-haspopup="true"
    aria-expanded="false" data-reference="parent">
    <i class=" fas fa-ellipsis-h "></i>
    </a>
    
    <a class="dropdown-item" href="/question/edit/${questionId}">
          <i class="far fa-edit"></i> Edit</a>
          <div class="dropdown-divider"></div>
          <form action="/api/question/delete/${questionId}?_method=DELETE" method="post">
              <input type="hidden" name="_method" value="DELETE">
              <i class="far fa-delete"></i> Delete
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
  conditional,
  showEditMenu,
};
