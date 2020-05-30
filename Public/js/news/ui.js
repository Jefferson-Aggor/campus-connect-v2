class UI {
  constructor() {
    this.output = document.getElementById("news-output");
    this.booksOutputLg = document.getElementById("#books-output");
    this.booksOutput = document.querySelector(".books-output");
    this.questionsOutput = document.querySelector("#posted-questions");
    this.questionsOutputSM = document.querySelector("#posted-questions-sm");
  }
  setTime(time) {
    moment(time).format("dddd, MMMM Do YYYY, h:mm a");
  }
  trimText = (text) => {
    if (text.length > 150) {
      return text.substring(0, 150) + "...";
    } else {
      return text;
    }
  };

  insertData(data) {
    this.output.innerHTML += `<div class="card mb-3 text-dark">
        <img src="${data.urlToImage}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title ">${data.title}</h5>
          <p class="card-text ">${data.content} <a href="${data.url}" target="_blank" rel="noopener noreferrer">Read more</a></p>
          <p class="card-text"><small class="text-muted">${data.author} | ${data.source.name}</small></p>
          <p class="card-text"><small class="text-muted">${data.publishedAt}</small></p>
        </div>
      </div>`;
  }

  setAlert(msg) {
    // create a div
    const div = document.createElement("div");
    div.classList = "alert alert-danger";
    div.appendChild(document.createTextNode(msg));
    const before = document.querySelector(".before");
    const parent = document.querySelector(".parent");

    parent.insertBefore(div, before);
  }
  clearBooks() {
    this.booksOutputLg.innerHTML = "";
  }
  clearBooksSM() {
    this.booksOutput.innerHTML = "";
  }
  clearNews() {
    this.output.innerHTML = "";
  }

  checkPDF(data) {
    if (data.accessInfo.pdf.acsTokenLink) {
      this.booksOutputLg.innerHTML += `
            <div class="card text-dark book-card">
                <div class="grid-2">
                    <img src="${data.volumeInfo.imageLinks.thumbnail}" alt="">
                    <div class="details">
                        <p>${data.volumeInfo.title}</p> <span>${data.volumeInfo.language}</span>
                        <p>${data.volumeInfo.publisher}</p>
                        
                    </div>
                </div>
                 <a href="${data.accessInfo.pdf.acsTokenLink}" class="btn btn-primary mt-1" target="_blank" rel="noopener noreferrer">Download PDF</a> 
        </div>`;
    } else {
      this.booksOutputLg.innerHTML += `
            <div class="card text-dark book-card">
                <div class="grid-2">
                    <img src="${data.volumeInfo.imageLinks.thumbnail}" alt="">
                    <div class="details">
                        <p>${data.volumeInfo.title}</p> <span>${data.volumeInfo.language}</span>
                        <p>${data.volumeInfo.publisher}</p>
                        
                    </div>
                </div>
                 <a href="${data.accessInfo.webReaderLink}" class="btn btn-primary mt-1" target="_blank" rel="noopener noreferrer">Read Book </a>
                   
                
        </div>`;
    }

    if (data.accessInfo.pdf.acsTokenLink && data.accessInfo.webReaderLink) {
      this.booksOutputLg.innerHTML += `
            <div class="card text-dark book-card hide">
            <div class="grid-2">
                <img src="${data.volumeInfo.imageLinks.thumbnail}" alt="">
                <div class="details">
                    <p>${data.volumeInfo.title}</p> <span>${data.volumeInfo.language}</span>
                    <p>${data.volumeInfo.publisher}</p>
                    
                </div>
            </div>
             <a href="${data.accessInfo.pdf.acsTokenLink}" class="btn btn-primary mt-1" target="_blank" rel="noopener noreferrer">Download PDF</a> 
    </div>


            <div class="card text-dark book-card">
                <div class="grid-2">
                    <img src="${data.volumeInfo.imageLinks.thumbnail}" alt="">
                    <div class="details">
                        <p>${data.volumeInfo.title}</p> <span>${data.volumeInfo.language}</span>
                        <p>${data.volumeInfo.publisher}</p>
                        
                    </div>
                </div>
                <div class='grid-2'>
                <a href="${data.accessInfo.pdf.acsTokenLink}" class="btn btn-primary mt-1" target="_blank" rel="noopener noreferrer">Download</a> 
                <a href="${data.accessInfo.webReaderLink}" class="btn btn-primary mt-1" target="_blank" rel="noopener noreferrer">Read </a>
                </div>
                
        </div>`;
    }
  }

  checkPDFSM(data) {
    this.booksOutput.innerHTML += `
    <div class="card">
  <img class="card-img-top" src="${
    data.volumeInfo.imageLinks.thumbnail
  }" alt="${data.volumeInfo.title}">
  <div class="card-body">
    <p class='text-muted'>${data.volumeInfo.title}</p>
    <p class="card-text">${this.trimText(data.volumeInfo.description)}</p>
    <a href="${
      data.accessInfo.webReaderLink
    }" class="btn btn-dark mt-1" target="_blank" rel="noopener noreferrer">Read or Download </a>
  </div>
</div>
    `;
  }

  questionsLg(data) {
    //  Check if image
    if (data.file) {
      console.log(data.file);
      this.questionsOutput.innerHTML += `
      <div class="card" >
      <img src="${data.file}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${data.topic}</h5>
        ${data.body}
        <div class="general-display-flex">
            <a href="#"><i class="fas fa-globe ml-2"></i></a>
           
        </div>
        <a href='/questions/${data._id}' class='btn btn-dark btn-block'>View Solution</a>
      </div>
    </div>
      `;
    } else {
      this.questionsOutput.innerHTML += `
      <div class="card" >
      <div class="card-body">
        <h5 class="card-title">${data.topic}</h5>
        <p class="card-text">${data.body}</p>
        <div class="general-display-flex">
            <a href="#"><i class="fas fa-globe ml-2"></i></a>
           
        </div>
        <a href='/questions/${data._id}' class='btn btn-dark btn-block'>View Solution</a>
      </div>
    </div>
      `;
    }
  }

  questionsSM(data) {
    //  Check if image
    if (data.file) {
      console.log(data.file);
      this.questionsOutputSM.innerHTML += `
      <div class="card" >
      <img src="${data.file}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${data.topic}</h5>
        ${data.body}
        <div class="general-display-flex">
            <a href="#"><i class="fas fa-globe ml-2"></i></a>
           
        </div>
        <a href='/questions/${data._id}' class='btn btn-dark btn-block'>View Solution</a>
      </div>
    </div>
      `;
    } else {
      this.questionsOutputSM.innerHTML += `
      <div class="card" >
      <div class="card-body">
        <h5 class="card-title">${data.topic}</h5>
        <p class="card-text">${data.body}</p>
        <div class="general-display-flex">
            <a href="#"><i class="fas fa-globe ml-2"></i></a>
           
        </div>
        <a href='/questions/${data._id}' class='btn btn-dark btn-block'>View Solution</a>
      </div>
    </div>
      `;
    }
  }
}
