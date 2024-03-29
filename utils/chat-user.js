const users = [];
module.exports = {
  joinUser: function (id, username, room) {
    const user = {
      id,
      username,
      room,
    };

    users.push(user);
    return user;
  },
  getUser: function (id) {
    return users.find((user) => user.id === id);
  },
  getAllUsers: function (room) {
    return users.filter((user) => user.room === room);
  },
  userLeave: function (id) {
    const user = users.findIndex((user) => user.id === id);
    if (user) {
      return users.splice(user, 1)[0];
    }
  },
};
