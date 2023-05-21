import { useEffect, useState } from "react";
import { db, auth } from "./../firebase";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc } from "firebase/firestore";

const Shelf = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchShelfBooks = async () => {
      try {
        const user = await new Promise((resolve) => {
          onAuthStateChanged(auth, (currentUser) => {
            resolve(currentUser);
          });
        });
    
        if (!user) {
          // User not logged in, handle the error
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }
    
        setIsLoggedIn(true);
    
        const userRef = doc(db, "users", user.uid);
        const booksRef = collection(userRef, "Shelf");
        const booksSnapshot = await getDocs(booksRef);
    
        const bookIds = booksSnapshot.docs.map((doc) => doc.data().bookId);
    
        // Fetch book details for each book in the shelf
        const bookDataPromises = bookIds.map((bookId) =>
          fetchBookDetails(bookId)
        );
    
        const bookData = await Promise.all(bookDataPromises);
        const booksWithAuthors = bookData.map((book) => {
          if (book.authors && book.authors.length > 0) {
            const authorRequests = book.authors.map((author) =>
              axios.get(`https://openlibrary.org${author.author.key}.json`)
            );
    
            return Promise.all(authorRequests).then((authorResponses) => {
              const authorData = authorResponses.map((response) => response.data);
              return {
                ...book,
                authors: authorData,
              };
            });
          }
          return book;
        });
    
        const updatedBooks = await Promise.all(booksWithAuthors);
        setBooks(updatedBooks);
        setIsLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.log("Error fetching shelf books:", error);
      }
    };
    
    fetchShelfBooks();
  }, []);

  const fetchBookDetails = async (bookId) => {
    try {
      if (!bookId) {
        console.log("Invalid bookId:", bookId);
        return null;
      }
      const response = await axios.get(
        `https://openlibrary.org/works/${bookId}.json`
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching book details:", error);
      return null;
    }
  };

  if (isLoading) {
    return <p>Loading shelf...</p>;
  }

  return (
    <div>
      <h2>Your Shelf</h2>
      {!isLoggedIn && (
        <p>You must be logged in to add books to your shelf.</p>
      )}
      {isLoggedIn && books.length === 0 && (
        <p>Your shelf is empty.</p>
      )}
      {books.length > 0 &&
        books
          .filter((book) => book !== null)
          .map((book, index) => (
            <div key={index}>
              <h3>{book.title}</h3>
              {book.covers && book.covers.length > 0 && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
                  alt="Book Cover"
                />
              )}
              <p>
                <strong>Written by:</strong>{" "}
                {book.authors && book.authors.length > 0
                  ? book.authors.map((author) => author.name).join(", ")
                  : "Unknown"}
              </p>
            </div>
          ))}
    </div>
  );
  
};

export default Shelf;
