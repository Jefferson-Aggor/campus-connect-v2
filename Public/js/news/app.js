// dom elements for large screen
const enterBook = document.getElementById("enter-book");
const selectNews = document.getElementById("selectNews");
const booksSearch = document.querySelector("#book-search");
const newsSearch = document.querySelector("#news-search");
const loader = document.querySelector(".loader");
const newsLoader = document.querySelector(".newsLoader");

// DOM ELEMENTS FOR SMALL SCREEN;
const searchBooksForm = document.getElementById("search-books-form");
const enterBookSm = document.getElementById("enter-book-sm");
const spinner = document.querySelector(".spinner");

loader.style.display = "none";
newsLoader.style.display = "none";
spinner.style.display = "none";

// initilize class
const data = new Data();
const ui = new UI();

booksSearch.addEventListener("click", (e) => {
  e.preventDefault();
  loader.style.display = "block";
  let enterBookVal = enterBook.value;
  ui.clearBooks();
  if (enterBookVal === "") {
    console.log("input empty");
    ui.setAlert("Input Empty");
    loader.style.display = "none";
  } else {
    // pass in the input value in to the books Class;
    let book = data.getBooks(enterBookVal);
    book
      .then((data) => {
        if (data.items === undefined) {
          loader.style.display = "none";
          ui.setAlert("Book not found.");
        } else {
          data.items.forEach((item) => {
            console.log(item);
            ui.checkPDF(item);
            loader.style.display = "none";
          });
        }
      })
      .catch((err) => {
        loader.style.display = "none";
        ui.setAlert(err);
      });
  }
  enterBook.value = "";
});

// using the news api
newsSearch.addEventListener("click", (e) => {
  e.preventDefault();

  const selectedVal = selectNews.value;
  newsLoader.style.display = "block";
  console.log(selectedVal);
  ui.clearNews();
  // pass the selected value into the getnews method;
  data
    .getNews(selectedVal)
    .then((data) => {
      if (!data) {
        newsLoader.style.display = "none";
        ui.setAlert("News not found. Try again later");
      } else {
        data.articles.forEach((datum) => {
          console.log(datum);
          newsLoader.style.display = "none";
          ui.insertData(datum);
        });
      }
    })
    .catch((err) => {
      newsLoader.style.display = "none";
      ui.setAlert(err);
    });
});

// SMALL SCREEN..
// TYPE: Search books

searchBooksForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const book = enterBookSm.value;
  spinner.style.display = "block";

  if (book === "") {
    console.log("input empty");

    spinner.style.display = "none";
  } else {
    data
      .getBooks(book)
      .then((books) => {
        if (books.totalItems > 0) {
          spinner.style.display = "none";
          console.log("BOOKS_FOUND :", books.totalItems);
          books.items.forEach((book) => {
            ui.checkPDFSM(book);
          });
        } else {
          spinner.innerHTML = `Book not found.`;
        }
      })
      .catch((err) => {
        spinner.innerHTML = `<span class="alert shadow  alert-dismissible fade show">${err}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </span>`;
      });
  }
});
