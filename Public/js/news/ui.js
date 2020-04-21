class UI {
  constructor() {
    this.output = document.getElementById("news-output");
    this.booksoutput = document.getElementById("books-output");
  }
  setTime(time) {
    moment(time).format("dddd, MMMM Do YYYY, h:mm a");
  }

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
    this.booksoutput.innerHTML = "";
  }
  clearNews() {
    this.output.innerHTML = "";
  }

  checkPDF(data) {
    if (data.accessInfo.pdf.acsTokenLink) {
      this.booksoutput.innerHTML += `
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
      this.booksoutput.innerHTML += `
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
      this.booksoutput.innerHTML += `
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
}
