// dom elemnets
const msgContainer = document.querySelector(".message-container");
const usersList = document.getElementById("pills-home");
const dateUI = document.getElementById("date");
const msgInput = document.getElementById("msg-input");
const chatFormLg = document.getElementById("chatFormLg");
const msgSend = document.getElementById("msg-send");
const fileInput = document.getElementById("file");

// small screen chat dom elements
const chatContainer = document.querySelector(".chat-container");
const messageForm = document.getElementById("message-form");
const chatInputSm = document.getElementById("chat-input-sm");
const fileSm = document.getElementById("file-sm");

// connect socket io
const socket = io();
// format time;
function formatTime(date) {
  return moment(date).format("h:mm a");
}
function formatDate(date) {
  return moment(date).format("dddd, MMM / DD / YYYY");
}

// Scroll to bottom
function scrollToBottom(parameter) {
  parameter.lastElementChild.scrollIntoView();
}

// Get the details in the URL.
let params = new URL(document.location).searchParams;

urlDetails = {
  name: params.get("username"),
  room: params.get("room"),
  id: params.get("id"),
};

// SMALL SIZED SCREENS CHAT;
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = chatInputSm.value;
  if (inputValue === "") {
    console.log("input empty");
  } else {
    socket.emit("text-message", inputValue, urlDetails);
    chatInputSm.value = "";
    chatInputSm.focus();
    chatContainer.lastElementChild.scrollIntoView();
  }
});

chatFormLg.addEventListener("submit", function (e) {
  e.preventDefault();

  const msgVal = msgInput.value;
  if (msgVal === "" || msgVal === null) {
    console.log("input empty");
  } else {
    socket.emit("text-message", msgVal, urlDetails);
    msgInput.value = "";
    msgInput.focus();
    const scrollLenght = msgContainer.lastElementChild.offsetTop + 1000;
    console.log(msgContainer.lastElementChild.offsetTop, scrollLenght);
    msgContainer.scrollTo(0, scrollLenght);
  }
});
fileInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (evt) {
    const fileDetails = {
      name: file.name,
      size: file.size,
      path: file.webkitRelativePath,
      type: file.type,
      fileEnctype: evt.target.result,
      userId: urlDetails.id,
    };
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      console.log(`file is a ${file.type} file`);

      socket.emit("image", fileDetails);
    }
    if (file.type === "video/mp4") {
      console.log(`file is a ${file.type} file`);
      socket.emit("video", fileDetails);
    }
    if (
      file.type === "audio/mp3" ||
      file.type === "audio/mpeg" ||
      file.type === "audio/mp4"
    ) {
      console.log(`file is a ${file.type} file`);
      socket.emit("audio", fileDetails);
    }
    if (file.type === "application/pdf") {
      console.log(`file is a ${file.type} file`);
      socket.emit("pdf", fileDetails);
    }
  };
  reader.readAsDataURL(file);
  scrollToBottom(msgContainer);
  console.log(file);
});

fileSm.addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (evt) {
    const fileDetails = {
      name: file.name,
      size: file.size,
      path: file.webkitRelativePath,
      type: file.type,
      fileEnctype: evt.target.result,
      userId: urlDetails.id,
    };
    if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      console.log(`file is a ${file.type} file`);

      socket.emit("image", fileDetails);
    }
    if (file.type === "video/mp4") {
      console.log(`file is a ${file.type} file`);
      socket.emit("video", fileDetails);
    }
    if (
      file.type === "audio/mp3" ||
      file.type === "audio/mpeg" ||
      file.type === "audio/mp4"
    ) {
      console.log(`file is a ${file.type} file`);
      socket.emit("audio", fileDetails);
    }
    if (file.type === "application/pdf") {
      console.log(`file is a ${file.type} file`);
      socket.emit("pdf", fileDetails);
    }
  };
  reader.readAsDataURL(file);
  scrollToBottom(chatContainer);
  console.log(file);
});

socket.emit("join-chat", urlDetails);

// chatbot messages on large screens
socket.on("chatbot-messages", (msg) => {
  chatBotMessages(msg, msgContainer);
});
// chatbot messages on small screens
socket.on("chatbot-messages", (msg) => {
  chatBotMessages(msg, chatContainer);
});

// text messages for large screens
//@TYPE: text;
socket.on("text-messages", (msg, details) => {
  if (urlDetails.id === details.id) {
    textMessageFromMe(msg, msgContainer);
  } else {
    textMessageFromOthers(msg, msgContainer);
  }
});

// @ TYPE: IMAGE
socket.on("image-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    imageFromMe(msg, msgContainer);
  } else {
    imageFromOthers(msg, msgContainer);
  }
});

// @ TYPE: AUDIO
socket.on("audio-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    audioFromMe(msg, msgContainer);
  } else {
    audioFromOthers(msg, msgContainer);
  }
});

// @ TYPE: VIDEO
socket.on("video-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    videoFromMe(msg, msgContainer);
  } else {
    videoFromOthers(msg, msgContainer);
  }
});

//  @ TYPE: PDF
socket.on("pdf-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    pdfFromMe(msg, msgContainer);
  } else {
    pdfFromOthers(msg, msgContainer);
  }
});

// text messages for small screens
// @TYPE: text;
socket.on("text-messages", (msg, details) => {
  if (urlDetails.id === details.id) {
    textMessageFromMe(msg, chatContainer);
  } else {
    textMessageFromOthers(msg, chatContainer);
  }
});

// @TYPE: IMAGE
socket.on("image-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    imageFromMe(msg, chatContainer);
  } else {
    imageFromOthers(msg, chatContainer);
  }
});
// @ TYPE: AUDIO
socket.on("audio-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    audioFromMe(msg, chatContainer);
  } else {
    audioFromOthers(msg, chatContainer);
  }
});

// @ TYPE: VIDEO
socket.on("video-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    videoFromMe(msg, chatContainer);
  } else {
    videoFromOthers(msg, chatContainer);
  }
});

//  @ TYPE: PDF
socket.on("pdf-from-server", (msg) => {
  console.log(msg);
  if (urlDetails.id === msg.userId) {
    pdfFromMe(msg, chatContainer);
  } else {
    pdfFromOthers(msg, chatContainer);
  }
});

// MESSAGES FROM DATABASE.
socket.on("prev-messages", (message) => {
  message.map((msg) => {
    // TYPE: Text
    if (msg.msgType === "text") {
      if (msg.userID === urlDetails.id) {
        textMessageFromMe(msg, msgContainer);
        textMessageFromMe(msg, chatContainer);
      } else {
        textMessageFromOthers(msg, msgContainer);
        textMessageFromOthers(msg, chatContainer);
      }
    }
    // TYPE: Image
    if (msg.msgType === "image") {
      if (msg.userID === urlDetails.id) {
        imageFromMe(msg, msgContainer);
        imageFromMe(msg, chatContainer);
      } else {
        imageFromOthers(msg, msgContainer);
        imageFromOthers(msg, chatContainer);
      }
    }
    // TYPE: Audio
    if (msg.msgType === "audio") {
      if (msg.userID === urlDetails.id) {
        audioFromMe(msg, msgContainer);
        audioFromMe(msg, chatContainer);
      } else {
        audioFromOthers(msg, msgContainer);
        audioFromOthers(msg, chatContainer);
      }
    }
    // TYPE : Video
    if (msg.msgType === "video") {
      if (msg.userID === urlDetails.id) {
        videoFromMe(msg, msgContainer);
        videoFromMe(msg, chatContainer);
      } else {
        videoFromOthers(msg, msgContainer);
        videoFromOthers(msg, chatContainer);
      }
    }

    // TYPE: Pdf
    if (msg.msgType === "pdf") {
      if (msg.userID === urlDetails.id) {
        pdfFromMe(msg, msgContainer);
        pdfFromMe(msg, chatContainer);
      } else {
        pdfFromOthers(msg, msgContainer);
        pdfFromOthers(msg, chatContainer);
      }
    }
  });
});

// * Chat functions *
function chatBotMessages(msg, placeholder) {
  placeholder.innerHTML += `
    <div class="mx-3 date" >
                <p>${msg}</p>
                <div class="clear"></div>
            </div>
            
    `;
}

// text message function;
function textMessageFromMe(msg, placeholder) {
  placeholder.innerHTML += `
  <div>
        <div class="text-messages chat-from-me">
               <div class="messages">
                   <div class="text">
                        ${msg.message}
                       <span class='text-grey'>${formatTime(msg.date)}</span>
                   </div>
               </div>
        </div>
           <div class="clear"></div>
  </div>
  `;
}

function textMessageFromOthers(msg, placeholder) {
  placeholder.innerHTML += `
       <div class="text-messages chat-from-others ">
                    <div class="messages">
                    <p class='text-muted'>${msg.username}</p>
                        <div class="text">${msg.message}
                        </div><span class='text-grey'>${formatTime(
                          msg.date
                        )}</span>
                    </div>
                </div>
       `;
}

// images function
function imageFromMe(msg, placeholder) {
  placeholder.innerHTML += `
<div>
    <div class="text-messages chat-from-me">
        <div class="messages">
            <div class="meta">
              <p>${formatTime(msg.date)}</p>
            </div>
          <img class="text img-fluid" src='${
            msg.message
          }' style='height:200px;width:200px' ">
        </div>
    </div>
    <div class="clear"></div>
</div>
`;
}
function imageFromOthers(msg, placeholder) {
  placeholder.innerHTML += `
  <div class="text-messages chat-from-others ">
    <div class="messages">
        <p class='text-muted'>${msg.username}</p>
        <img class="text img-fluid" src='${
          msg.message
        }' style='height:200px;width:200px' ">
        <p class='text-muted'>${formatTime(msg.date)}</p> 
    </div>
</div>
  `;
}

// audio functions
function audioFromMe(msg, placeholder) {
  placeholder.innerHTML += `
<div>
    <div class="text-messages chat-from-me">
        <div class="messages">
            <div class="meta">
              <p>${formatTime(msg.date)}</p>
            </div>
            <audio src="${msg.message}" controls ></audio>
        </div>
    </div>
    <div class="clear"></div>
</div>
`;
}
function audioFromOthers(msg, placeholder) {
  placeholder.innerHTML += `
  <div class="text-messages chat-from-others ">
    <div class="messages">
        <p class='text-muted'>${msg.username}</p>
        <audio src="${msg.message}" controls ></audio>
        <p class='text-muted'>${formatTime(msg.date)}</p>
    </div>  
  </div>
  `;
}

// video functions
function videoFromMe(msg, placeholder) {
  placeholder.innerHTML += `
  <div>
    <div class="text-messages chat-from-me">
        <div class="messages">
          <div class="meta">
              <p>${formatTime(msg.date)}</p>
          </div>
          <video src="${
            msg.message
          }" controls style="width:200px;height:200px"></video
        </div>
    </div>
    <div class="clear"></div>
  </div>
`;
}
function videoFromOthers(msg, placeholder) {
  placeholder.innerHTML += `
<div class="text-messages chat-from-others">
    <div class="messages">
        <p class='text-muted'>${msg.username}</p>
        <video src="${
          msg.message
        }" controls style="width:200px;height:200px"></video>
        <p class='text-muted'>${formatTime(msg.date)}</p>
    </div>
</div>
  `;
}

// pdf functions
function pdfFromMe(msg, placeholder) {
  placeholder.innerHTML += `
  <div>
      <div class="text-messages chat-from-me">
          <div class="messages">
              <div class="meta">
                  <p>${formatTime(msg.date)}</p>
              </div>
              <div>
              <iframe src="${msg.message}" frameborder="0"></iframe>
                  <a href='${msg.message}' download>Download</div>
              </div> 
          </div>
      </div>
      <div class="clear"></div>
  </div>
`;
}

function pdfFromOthers(msg, placeholder) {
  placeholder.innerHTML += `
  <div class="text-messages chat-from-others">
      <div class="messages">
      <p class='text-muted'>${msg.username}</p>
        <div>
            <iframe src="${msg.message}" frameborder="0"></iframe>
            <a href='${msg.message}' download>Download</div>
        </div>
        <p class='text-muted'>${formatTime(msg.date)}</p>
      </div>
  </div>

  `;
}
