import { useState, useEffect, useRef } from "react";
import axios from "axios";

const PopularBooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bookContainerRef = useRef(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://openlibrary.org/api/books?bibkeys=ISBN:0765387565,ISBN:0061120081,ISBN:9780743273565,ISBN:0735219095,ISBN:9780451524935,ISBN:0141439564,ISBN:0062060619,ISBN:0525536970,ISBN:006286893X,ISBN:1501176834,ISBN:1501111671,ISBN:0571334652,ISBN:0385521316,ISBN:1250237231,ISBN:1982113544,ISBN:1250758009,ISBN:0571347290,ISBN:0307275917,ISBN:1250307201,ISBN:9781501135927,ISBN:9780735211292&format=json&jscmd=data"
      );
      const bookData = response.data;
      const booksArray = Object.keys(bookData).map((key) => bookData[key]);
      setBooks(booksArray);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching books:", error);
    }
  };


  return (
    <div>
      <h1>Popular Books</h1>
      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <div className="book-container" ref={bookContainerRef}>           
                {books.map((book) => (
                <div key={book.key} className="book-card">
                        {book.cover && (
                        <img
                            src={book.cover.large}
                            alt="Book Cover"
                            className="book-cover"
                        />
                        )}                
                    <div className="overlay">
                        <h3 className="book-title">{truncateText(book.title, 30)}</h3>
                        {book.authors && (
                            <p className="book-author">
                            {truncateText(getAuthorNames(book.authors), 30)}
                            </p>
                        )}
                    </div>
                </div>
                ))}  
        </div>
      )}
    </div>
  );
};

// Helper function to truncate text and add ellipsis
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substr(0, maxLength - 3) + "...";
};

// Helper function to get formatted author names
const getAuthorNames = (authors) => {
  return authors.map((author) => author.name).join(", ");
};

export default PopularBooks;
