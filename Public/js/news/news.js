class Data {
  constructor() {
    this.newsapiKey = "a97481c13fb5422188141ed04b956ee6";
    this.booksapikey = "AIzaSyAOZDpitKja4OB6p6Apb2MV0LCuVd5OW5I";
    this.defaultRootUrl = `https://campusconnectversion.herokuapp.com/api`;
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
      `https://www.googleapis.com/books/v1/volumes?q=${books}&download=epub&orderBy=newest&filter=free-ebooks&key=${this.booksapikey}`
    );

    const responseData = await response.json();

    return responseData;
  }
  async getPosts() {
    const response = await fetch(`${this.defaultRootUrl}/posts`);
    const responseData = await response.json();

    return responseData;
  }
  async getQuestions(relatedTo) {
    const response = await fetch(
      `${this.defaultRootUrl}/questions/${relatedTo}`
    );

    const responseData = await response.json();

    return responseData;
  }
}
