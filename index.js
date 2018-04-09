'use strict'

// Globals
const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";
const NYT_API_URL = "https://api.nytimes.com/svc/books/v3/lists.json?api-key=ecb23c2aa6254b85b8623e1916c960f3";

var searchIndex = 0;
var query = '';

const sections = [
    "business-books",
    "science",
    "combined-print-and-e-book-fiction",
    "combined-print-and-e-book-nonfiction",
    "sports",
    "childrens-middle-grade-hardcover",
    "young-adult-hardcover"
]

var googleAjaxData = {
    maxResults: 40,
    printType: "books",
    startIndex: searchIndex,
    q: query,
    key: 'AIzaSyDWsuOWHIZR5JGWfFhtn9oloel8bsNRQR4'
}

var nyAjaxData = {
    list: ''
}


// API ajax call
function getBooksFromAPI(api_url, ajaxData, callback) {
    const settings = {
        url: api_url,
        data: ajaxData,
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    return $.ajax(settings);
}

function checkForItemsReceived(item) {
    if (item.totalItems === 0 || (!(item.items))) {
        return false;
    } else {
        return true;
    }
}


function normalizeSearchData(item) {
    let bookElement = {
        isbn: '',
        snippet: '',
        author: '',
        thumbnail: 'https://image.ibb.co/bYtXH7/no_cover_en_US.jpg'
    }

    if ((item.volumeInfo.industryIdentifiers) &&
        (item.volumeInfo.industryIdentifiers[0].type === "ISBN_10")) {
        bookElement.isbn = item.volumeInfo.industryIdentifiers.find(function (obj) {
            return obj.type === 'ISBN_10';
        }).identifier
    }

    if (item.volumeInfo.imageLinks) {
        bookElement.thumbnail = item.volumeInfo.imageLinks.thumbnail;
    }

    if (item.searchInfo) {
        bookElement.snippet = item.searchInfo.textSnippet;
    }

    if (item.volumeInfo.authors) {
        bookElement.author = item.volumeInfo.authors[0];
    }

    bookElement.id = item.id;
    bookElement.title = item.volumeInfo.title;

    return bookElement;
}


// Passing the results to HTML
function displaySearchData(data) {
    if (checkForItemsReceived(data)) {
        const results = data.items.map((item, index) => {
            let book = normalizeSearchData(item);
            return renderBooks(book);
        });
        $('.book-container').append(results);
    }
}

// on submit
function watchSubmit() {
    $(".js-mainHeader").click(event => {
        $("form input").val('');
        renderEmptyForm();
        showBestSeller();
    });

    $('.js-searchSubmit').click(event => {
        $(".js-form").submit();
    })

    $('.js-form').submit(event => {
        event.preventDefault();
        query = $(event.currentTarget).find('.search-field').val();
        searchIndex = 0;
        googleAjaxData.q = query;
        googleAjaxData.startIndex = searchIndex;
        renderEmptyForm();
        getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData, displaySearchData);
    });
}

// speech functionality
function speechRecognition() {
    $("form").on('click', '.js-voice-search', function (event) {
        event.preventDefault();
        startDictation();
    })
}

function startDictation() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.start();
        recognition.onresult = function (e) {
            query = e.results[0][0].transcript;
            recognition.stop();
            searchIndex = 0;
            $('.search-field').val(query);
            googleAjaxData.q = query;
            googleAjaxData.startIndex = searchIndex;
            renderEmptyForm();
            getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData, displaySearchData)
        };
        recognition.onerror = function (e) {
            recognition.stop();
        }
    }
}

// infinite scroll 
function infiniteScroll() {
    var win = $(window);
    win.scroll(function () {
        if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
            query = $('.js-form').find('.search-field').val();
            googleAjaxData.q = query;
            if (googleAjaxData.q !== '') {
                searchIndex += 40;
                googleAjaxData.startIndex = searchIndex;
                getBooksFromAPI(GOOGLE_BOOKS_API_URL, googleAjaxData, displaySearchData);
            }
        }
    });
};

// RENDER

function renderBooks(book) {
    return `
      <div class="book col">
        <div class="bookItem w3-animate-opacity">
          <i class="test fa fa-eye fa-lg"></i>        
          <i class="fa fa-heart fa-lg"></i>   
          <div class='star-rating'>
            <i class="fa fa-star"></i>   
            <i class="fa fa-star"></i>   
            <i class="fa fa-star"></i>   
            <i class="fa fa-star"></i>   
            <i class="fa fa-star-half-full"></i>   
            <span>4.5/5</span>         
          </div>            
          <a href='#${book.id}'>
            <img src="${book.thumbnail}" alt=${book.title} book cover>                 
          </a>
          <p class="title">${book.title}</p>  
          
          <div class="lightbox" id="${book.id}">
            <div class="lightbox-content">
              <a href="#_" class="fa fa-close fa-2x"></a>
              <img src="${book.thumbnail}">
              <h4>${book.title} <h6>by</h6> <h5>${book.author}</h5></h4>
              <p class="book-description">${book.snippet}</p>
            </div>
          </div>        
        </div>      
      </div>        
      `;
  }
  

// page on load
function onLoadTrigger() {
    $(watchSubmit());
    $(speechRecognition());
    $(infiniteScroll());
    // $(showBestSeller())
}

$(onLoadTrigger());