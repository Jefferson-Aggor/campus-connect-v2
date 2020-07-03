const socketio = io();

const likeButton = document.getElementById("like");
const likesCount = document.querySelector(".likes-count");
const getLikesCount = document.querySelector(".getLikesCount");
const questionId = document.getElementById("questionId");
const loggedUserId = document.getElementById("loggedUserId");

likeButton.addEventListener("click", function (e) {
  e.preventDefault();
  const likes = Number(getLikesCount.value);
  socketio.emit("liked", likes, questionId.value, loggedUserId.value);
});

socketio.on("like", (like) => {
  let likeicon = document.querySelector(".fa-heart");
  if (like.liked) {
    likeicon.classList.add("text-red");
  } else {
    likesCount.innerHTML = like.message;
    likeicon.classList.add("text-red");
  }
});
