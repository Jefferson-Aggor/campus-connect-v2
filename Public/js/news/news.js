class Data {
    constructor() {
        this.newsapiKey = "a97481c13fb5422188141ed04b956ee6";
        this.booksapikey = "AIzaSyAOZDpitKja4OB6p6Apb2MV0LCuVd5OW5I";
        this.maxResults = 5;
    }

    async getNews(news) {
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?category=${news}&startIndex=0&maxResults=${this.maxResults}&apiKey=${this.newsapiKey}`
        );
        const responseData = await response.json();

        return responseData;
    }
    async getBooks(books) {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${books}&download=epub&key=${this.booksapikey}`
        );

        const responseData = await response.json();

        return responseData;
    }
}

