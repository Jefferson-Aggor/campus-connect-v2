// dom elements
const enterBook = document.getElementById("enter-book");
const selectNews = document.getElementById("selectNews");
const booksSearch = document.querySelector("#book-search");
const newsSearch = document.querySelector("#news-search");
const loader = document.querySelector(".loader");
const newsLoader = document.querySelector('.newsLoader')

loader.style.display = 'none'
newsLoader.style.display = 'none'

// initilize class
const data = new Data();
const ui = new UI();

booksSearch.addEventListener("click", (e) => {
    e.preventDefault();
    loader.style.display = 'block'
    let enterBookVal = enterBook.value;
    ui.clearBooks()
    if (enterBookVal === "") {
        console.log("input empty");
        ui.setAlert("Input Empty");
        loader.style.display = 'none'
    } else {
        // pass in the input value in to the books Class;
        let book = data.getBooks(enterBookVal);
        book.then(data => {

            if (data.items === undefined) {
                loader.style.display = 'none'
                ui.setAlert('Book not found.')
            } else {
                data.items.forEach(item => {
                    console.log(item)
                    ui.checkPDF(item)
                    loader.style.display = 'none'
                })
            }
        }).catch(err => {
            loader.style.display = 'none'
            ui.setAlert(err)

        })
    }
    enterBook.value = "";
});

// using the news api
newsSearch.addEventListener('click', (e) => {
    e.preventDefault();


    const selectedVal = selectNews.value;
    newsLoader.style.display = 'block'
    console.log(selectedVal)
    ui.clearNews()
    // pass the selected value into the getnews method;
    data.getNews(selectedVal).then(data => {
        if (!data) {
            newsLoader.style.display = 'none'
            ui.setAlert('News not found. Try again later')
        } else {
            data.articles.forEach(datum => {
                console.log(datum)
                newsLoader.style.display = 'none'
                ui.insertData(datum)
            })
        }
    }).catch(err => {
        newsLoader.style.display = 'none'
        ui.setAlert(err)
    })
})

// const data = new Data();

// const ui = new UI();

// let news = data.getNews("science");
// let books = data.getBooks("dynamics of machines");

// news.then((data) => {
//     data.articles.forEach((datum) => {
//         ui.insertData(datum);
//     });
// });
// books.then((data) => {
//     console.log(data.items[0].accessInfo);
//     data.items.forEach((item) => {
//         ui.insertBooks(item);
//     });
// });

