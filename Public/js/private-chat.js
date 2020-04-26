const msgInput = document.getElementById("msg-input");
const msgContainer = document.querySelector(".message-container");
const fileSend = document.getElementById("file");
const msgSend = document.getElementById("msg-send");

// init socket io
const socket = io();

let params = new URL(document.location).searchParams;

let messageDetails = {
  to: params.get("to"),
  from: params.get("from"),
};

socket.emit("private-chat-users", messageDetails);

msgSend.addEventListener("click", (e) => {
  e.preventDefault();

  const msg = msgInput.value;
  //   emit the message to server;
  socket.emit("private-text", msg, messageDetails);
  msgInput.value = "";
  msgInput.focus();

  msgContainer.innerHTML += `<div>
  <div class="text-messages chat-from-me text-red">
      <div class="messages">
          <div class="text">
              ${msg}
          </div>
      </div>
  </div>
  <div class="clear"></div>
</div>
`;
});
socket.on("new_message", (msg, messageDetails) => {
  msgContainer.innerHTML += `
  <div class="text-messages ">
               <div class="messages">
                   <div class="text">${msg}
                   </div>
               </div>
           </div>
  `;
});
