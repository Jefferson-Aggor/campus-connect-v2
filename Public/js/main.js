// dom elemnets
const msgContainer = document.querySelector(".message-container");
const usersList = document.getElementById("pills-home");
const dateUI = document.getElementById("date");
const msgInput = document.getElementById("msg-input");
const msgSend = document.getElementById("msg-send");
const fileInput = document.getElementById("file");

// connect socket io
const socket = io();

// format time;
function formatTime(date) {
  return moment(date).format("h:mm a");
}
function formatDate(date) {
  return moment(date).format("dddd, MMM / DD / YYYY");
}

let params = new URL(document.location).searchParams;

urlDetails = {
  name: params.get("username"),
  room: params.get("room"),
  id: params.get("id"),
};

console.log(urlDetails);

// send the connected users to the server;
socket.on("users", (data) => {
  usersList.innerHTML += "";
  data.users.map((datum) => {
    usersList.innerHTML += `
    <p><a href='/'>${datum.username}</a></p>
    `;
  });
});

msgSend.addEventListener("click", function (e) {
  e.preventDefault();

  const msgVal = msgInput.value;
  if (msgVal === "" || msgVal === null) {
    console.log("input empty");
  } else {
    socket.emit("text-message", msgVal, urlDetails);
    msgInput.value = "";
    msgInput.focus();
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
  console.log(file);
});

socket.emit("join-chat", urlDetails);

// chatbot messages
socket.on("chatbot-messages", (msg) => {
  msgContainer.innerHTML += `
    <div class="mx-3 date" >
              
                <p>${msg}</p>
            </div>
    `;
});
// loading the messages from the database
socket.on("prev-messages", (messages) => {
  messages.map((message) => {
    if (message.msgType === "text") {
      if (message.userID === urlDetails.id) {
        dateUI.innerHTML += `
       <p class="btn bg-dark">${formatDate(message.date)}</p>
       `;
        msgContainer.innerHTML += `
       <div>
                <div class="text-messages chat-from-me">
                    <div class="messages">
                        <div class="text">
                            ${message.message}
                            <span class='text-grey'>${formatTime(
                              message.date
                            )}</span>
                        </div>
                    </div>
                </div>
                <div class="clear"></div>
            </div>
       `;
      } else {
        msgContainer.innerHTML += `
        <div class="text-messages ">
                     <div class="image">
                         <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
                     </div>
                     <div class="messages">
                         <div class="meta">
                             <p><a href='/chat-room/private-chat/?from=${
                               urlDetails.name
                             }&to=${
          message.username
        }' target="_blank" rel="noopener noreferrer">${message.username}</a></p>
                             <p>${formatTime(message.date)}</p>
                         </div>
                         <div class="text">${message.message}</div>
                     </div>
                 
          </div>       
        `;
      }
    }
    if (message.msgType === "image") {
      if (message.userID === urlDetails.id) {
        msgContainer.innerHTML += `
  <div>
<div class="text-messages chat-from-me">

<div class="messages">
  <div class="meta">
      
      <p>${formatTime(message.date)}</p>
  </div>
  <img class="text img-fluid" src='${
    message.message
  }'  style="width:200px;height:200px">
 
</div>
</div>
<div class="clear"></div>
</div>
`;
      } else {
        msgContainer.innerHTML += `
  <div class="text-messages ">
  <div class="image">
      <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
  </div>
        <div class='messages'>
          <div class="meta">
            <p>${message.username}</p>
            <p>${formatTime(message.date)}</p>
          </div>
        <img class="text img-fluid" src='${
          message.message
        }'  style="width:200px;height:200px">

        </div>
</div>
  `;
      }
    }
    if (message.msgType === "audio") {
      if (message.userID === urlDetails.id) {
        msgContainer.innerHTML += `
        <div>
<div class="text-messages chat-from-me">
<div class="messages">
  <div class="meta">
      <p>${formatTime(message.date)}</p>
  </div>
  <audio src="${message.message}" controls ></audio>
</div>
</div>
<div class="clear"></div>
</div>
        `;
      } else {
        msgContainer.innerHTML += `
        <div class="text-messages ">
        <div class="image">
            <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
        </div>
        <div class="messages">
            <div class="meta">
                <p>${message.username}</p>
                <p>${message.date}</p>
            </div>
        <audio src="${message.message}" controls ></audio>
        </div>
      </div>
        `;
      }
    }
  });
});

// client messages
socket.on("text-messages", (msg, details) => {
  if (urlDetails.id === details.id) {
    textMessageFromMe(msg);
  } else {
    textMessageFromOthers(msg);
  }
});

socket.on("image-from-server", (msg, image) => {
  if (urlDetails.id === image.userId) {
    imageFromMe(msg, image);
  } else {
    imageFromOthers(msg, image);
  }
});

socket.on("video-from-server", (msg, video) => {
  if (urlDetails.id === video.userId) {
    videoFromMe(msg, video);
  } else {
    videoFromOthers(msg, video);
  }
});

socket.on("audio-from-server", (msg, audio) => {
  console.log(audio);
  if (urlDetails.id === audio.userId) {
    audioFromMe(msg, audio);
  } else {
    audioFromOthers(msg, audio);
  }
});

socket.on("pdf-from-server", (msg, pdf) => {
  if (urlDetails.id == pdf.userId) {
    pdfFromME(msg, pdf);
  } else {
    pdfFromOthers(msg, pdf);
  }
});

// messages
function textMessageFromMe(msg) {
  msgContainer.innerHTML += `
       <div>
                <div class="text-messages chat-from-me">
                    <div class="messages">
                        <div class="text">
                            ${msg.msg}
                            
                            <span class='text-grey'>${msg.date}</span>
                       
                        </div>
                    </div>
                </div>
               
                <div class="clear"></div>
            </div>
       `;
}
function textMessageFromOthers(msg) {
  msgContainer.innerHTML += `
       <div class="text-messages ">
                    <div class="image">
                        <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
                    </div>
                    <div class="messages">
                        <div class="meta">
                        
                            <p><a href='/chat-room/private-chat/?from=${urlDetails.name}&to=${msg.username}' target='_blank'>${msg.username}</a></p>
                            <p>${msg.date}</p>
                        </div>
                        <div class="text">${msg.msg}
                        </div>
                    </div>
                </div>
       `;
}

function imageFromMe(msg, image) {
  msgContainer.innerHTML += `
  <div>
<div class="text-messages chat-from-me">

<div class="messages">
  <div class="meta">
      
      <p>${msg.date}</p>
  </div>
  <img class="text img-fluid" src='${image.fileEnctype}'  style="width:200px;height:200px">
 
</div>
</div>
<div class="clear"></div>
</div>
`;
}
function imageFromOthers(msg, image) {
  msgContainer.innerHTML += `
  <div class="text-messages ">
  <div class="image">
      <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
  </div>
  <div class="messages">
      <div class="meta">
          <p>${msg.username}</p>
          <p>${msg.date}</p>
      </div>
      <img class="text img-fluid" src='${image.fileEnctype}'  style="width:200px;height:200px">
     
  </div>
</div>
  `;
}

function videoFromMe(msg, video) {
  msgContainer.innerHTML += `
  <div>
<div class="text-messages chat-from-me">

<div class="messages">
  <div class="meta">
      <p>${msg.date}</p>
  </div>
  <video src="${video.fileEnctype}" controls style="width:200px;height:200px"></video
</div>
</div>
<div class="clear"></div>
</div>
`;
}

function videoFromOthers(msg, video) {
  msgContainer.innerHTML += `
  <div class="text-messages ">
  <div class="image">
      <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
  </div>
  <div class="messages">
      <div class="meta">
          <p>${msg.username}</p>
          <p>${msg.date}</p>
      </div>
      <video src="${video.fileEnctype}" controls style="width:200px;height:200px"></video>
  </div>
</div>
  `;
}
function audioFromMe(msg, audio) {
  msgContainer.innerHTML += `
  <div>
<div class="text-messages chat-from-me">
<div class="messages">
  <div class="meta">
      <p>${msg.date}</p>
  </div>
  <audio src="${audio.fileEnctype}" controls ></audio>
</div>
</div>
<div class="clear"></div>
</div>
`;
}
function audioFromOthers(msg, audio) {
  msgContainer.innerHTML += `
  <div class="text-messages ">
  <div class="image">
      <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
  </div>
  <div class="messages">
      <div class="meta">
          <p>${msg.username}</p>
          <p>${msg.date}</p>
      </div>
  <audio src="${audio.fileEnctype}" controls ></audio>

     
  </div>
</div>
  `;
}

function pdfFromME(msg, pdf) {
  msgContainer.innerHTML += `
    <div>
        <div class="text-messages chat-from-me">
            <div class="messages">
                <div class="meta">
                    
                    <p>${msg.date}</p>
                </div>
                <div>
                    <embed src="${pdf.fileEnctype}" type="application/pdf">
                    <p >${pdf.name}</p>
                    <a href='${pdf.fileEnctype}' download>Download</div>
                </div> 
            
            </div>
        </div>
        <div class="clear"></div>
    </div>
`;
}
function pdfFromOthers(msg, pdf) {
  msgContainer.innerHTML += `
  <div class="text-messages ">
      <div class="image">
          <img src="/img/schoolbooks.png" class="img-fluid" alt="" style="width:70px;height:70px">
      </div>
      <div class="messages">
          <div class="meta">
              <p>${msg.username}</p>
              <p>${msg.date}</p>
          </div>
      </div>    
      <div>
          <embed src="${pdf.fileEnctype}" type="application/pdf">
          <p >${pdf.name}</p>
          <a href='${pdf.fileEnctype}' download>Download</div>
      </div>   
  
  </div>

  `;
}

// Private Chats;
