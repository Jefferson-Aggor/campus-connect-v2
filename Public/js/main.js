// dom elemnets
const msgContainer = document.querySelector(".message-container");
// const dateUI = document.getElementById("date");
const msgInput = document.getElementById("msg-input");
const msgSend = document.getElementById("msg-send");
const fileInput = document.getElementById("file");

// connect socket io
const socket = io();

let params = new URL(document.location).searchParams;

urlDetails = {
  name: params.get("username"),
  room: params.get("room"),
  id: params.get("id"),
};

console.log(urlDetails);

msgSend.addEventListener("click", function (e) {
  e.preventDefault();
  const msgVal = msgInput.value;
  socket.emit("text-message", msgVal, urlDetails);
  msgInput.value = "";
  msgInput.focus();
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
    if (file.type === "audio/mp3") {
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
                <p class="">${msg}</p>
            </div>
    `;
});
// client messages
socket.on("text-messages", (msg, details) => {
  if (urlDetails.id === details.id) {
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
  } else {
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
                        <div class="text">${msg.msg}
                        </div>
                    </div>
                </div>
       `;
  }
});

socket.on("image-from-server", (msg, image) => {
  if (urlDetails.id === image.userId) {
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
  } else {
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
});

socket.on("video-from-server", (msg, video) => {
  if (urlDetails.id === video.userId) {
    msgContainer.innerHTML += `
        <div>
    <div class="text-messages chat-from-me">
    
    <div class="messages">
        <div class="meta">
            
            <p>${msg.date}</p>
        </div>
        <video src="${video.fileEnctype}" controls style="width:200px;height:200px"></video>
       
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
            <p>${msg.username}</p>
            <p>${msg.date}</p>
        </div>

        
    <video src="${video.fileEnctype}" controls style="width:200px;height:200px"></video>

       
    </div>
</div>
    `;
  }
});
socket.on("audio-from-server", (msg, audio) => {
  if ((urlDetails, audio.urlDetails)) {
    msgContainer.innerHTML += `
        <div>
    <div class="text-messages chat-from-me">
    
    <div class="messages">
        <div class="meta">
            
            <p>${msg.date}</p>
        </div>
        <audio src="${audio.fileEnctype}" controls "></audio>
       
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
            <p>${msg.username}</p>
            <p>${msg.date}</p>
        </div>

        
    <audio src="${audio.fileEnctype}" controls "></audio>

       
    </div>
</div>
    `;
  }
});
socket.on("pdf-from-server", (msg, pdf) => {
  if (urlDetails.id == pdf.userId) {
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
  } else {
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
});
