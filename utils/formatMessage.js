module.exports = {
  formatMessage: function (username, message, userId) {
    return {
      username,
      message,
      userId,
      date: Date.now(),
    };
  },
};
