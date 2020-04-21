const moment = require("moment");

module.exports = {
  formatMessage: function (username, msg) {
    return {
      username,
      msg,
      date: moment().format("h:mm a"),
    };
  },
  formatDate: function (date) {
    return {
      time: moment(date).format("h:mm a"),
    };
  },
};
