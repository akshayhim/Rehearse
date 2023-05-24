import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import "./Home.css";


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
        "https://openlibrary.org/api/books?bibkeys=ISBN:1416524797,ISBN:9780735211292,ISBN:0061122416,ISBN:0307474275,ISBN:0307474275,ISBN:0307588378,ISBN:1594634025,ISBN:0439023521,ISBN:0804137501,ISBN:0062024027,ISBN:0385348843,ISBN:0307951529,ISBN:0804137382,ISBN:0345472322,ISBN:0307465357,ISBN:1544512287,ISBN:1577314808,ISBN:0316556343,ISBN:0735213186,ISBN:0804172447,ISBN:0786883561,ISBN:0735220690,ISBN:0140449337&format=json&jscmd=data"
      );
      const bookData = response.data;
      const booksArray = Object.keys(bookData).map((key) => bookData[key]);
      setBooks(booksArray);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching books:", error);
    }
  };

  const truncateText = (text, limit) => {
    if (text && text.split(" ").length > limit) {
      return text.split(" ").slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  const bookDetailsLinks = [
    "/book/OL76833W",
    "/book/OL17930368W",
    "/book/OL24793568W",
    "/book/OL76837W",
    "/book/OL16239762W",
    "/book/OL17112428W",
    "/book/OL5735363W",
    "/book/OL17845541W",
    "/book/OL15719630W",
    "/book/OL19990061W",
    "/book/OL16499348W",
    "/book/OL17043626W",
    "/book/OL8697719W",
    "/book/OL17060108W",
    "/book/OL24583599W",
    "/book/OL18176272W",
    "/book/OL31658255W",
    "/book/OL18020313W",
    "/book/OL17202418W",
    "/book/OL15111501W",
    "/book/OL1317211W",
  ];

  return (
    <div>
      
      {isLoading ? (
        <p>Loading books...</p>
      ) : (
        <div className="book-container" ref={bookContainerRef}>
          {books.map((book, index) => (
            <Link
              key={book.key}
              to={bookDetailsLinks[index]}
              className="book-card"
            >
              {book.cover && (
                <img
                  src={book.cover.large}
                  alt="Book Cover"
                  className="book-cover"
                />
              )}
              <div className="overlay">
              <h3 className="book-title">
                  {truncateText(book.title, 2.5)} {/* Display only first 3 words */}
                </h3>
                {book.authors && (
                  <p className="book-author">
                    {truncateText(book.authors.map((author) => author.name).join(", "), 2)} {/* Display only first 2 words */}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularBooks;
