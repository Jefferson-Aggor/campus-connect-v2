module.exports = {
  checkIfLiked: function (arr, id) {
    return arr.find((likes) => likes.likedBy.toString() === id.toString());
  },
};
