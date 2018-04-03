function renderBooks(results, thumbnail, ISBN) {
  return `
        <div class="book col">
          <img src="${thumbnail}" alt=${results.volumeInfo.title} book cover>                 
          <p>TITLE: ${results.volumeInfo.title}</p>        
          <p>AUTHOR: ${results.volumeInfo.authors}</p> 
          <button>
            <a href="https://www.amazon.com/dp/${ISBN}" target=_blank>Buy on Amazon</a>
          </button>      
          <button>
            <a href="http://search.barnesandnoble.com/booksearch/ISBNInquiry.asp?EAN=${ISBN}" target=_blank>Buy on Barns and Noble</a>
          </button>                    
          <button>
            <a href="http://www.booksamillion.com/p/${ISBN}?" target=_blank>Buy on Books a Million</a>
          </button>            
        </div>
      `;
}


function renderBestSellers(results, thumbnail, ISBN) {
  return `
      <div class="book col">
        <img src="${thumbnail}">   
        <p class="title">${results.book_details[0].title.toLowerCase()}</p>
        <!--p>AUTHOR: ${results.book_details[0].author}</p>        
        <p>DATE BEST SELLER: ${results.bestsellers_date}</p>  
        <p>BEST SELLER RANK: ${results.rank}</p>  
        <button>
          <a href=${results.amazon_product_url} target=_blank>Buy on Amazon</a>
        </button>        
        <button>
          <a href="http://search.barnesandnoble.com/booksearch/ISBNInquiry.asp?EAN=${ISBN}" target=_blank>Buy on Barns and Noble</a>
        </button> 
        <button>
          <a href="http://www.booksamillion.com/p/${ISBN}?" target=_blank>Buy on Books a Million</a>
        </button -->
        
      </div>
    `;
}