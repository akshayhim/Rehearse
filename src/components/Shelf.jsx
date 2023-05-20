import { useEffect, useState } from "react";
import { db } from "./../firebase"; // Import the Firestore object as db
import axios from "axios";
import { auth } from "./../firebase"; // Import the firebase object

const Shelf = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchShelfBooks = async () => {
      try {
        const user = auth.currentUser; // Access the currentUser from the imported firebase object
        if (!user) {
          // User not logged in, handle the error
          return;
        }
    
        const shelfRef = db.collection("shelves").where("userId", "==", user.uid);
    
        const snapshot = await shelfRef.get();
        const bookIds = snapshot.docs.map((doc) => doc.data().bookId);
    
        // Fetch book details for each book in the shelf
        const bookDataPromises = bookIds.map((bookId) =>
          fetchBookDetails(bookId)
        );
    
        const bookData = await Promise.all(bookDataPromises);
        setBooks(bookData);
      } catch (error) {
        console.log("Error fetching shelf books:", error);
      }
    };    

    fetchShelfBooks();
  }, []);

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/works/${bookId}.json`
      );
      return response.data;
      
    } catch (error) {
      console.log("Error fetching book details:", error);
      return null;
    }
  };

  return (
    <div>
      <h2>Your Shelf</h2>
      {books.length > 0 ? (
        books.map((book, index) => (
          <div key={index}>
            <h3>{book.title}</h3>
            {book.covers && book.covers.length > 0 && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-S.jpg`}
                alt="Book Cover"
              />
            )}
            <p>
              <strong>Written by:</strong>{" "}
              {book.authors.map((author) => author.name).join(", ")}
            </p>
            {(book.description || book.subtitle) && (
              <p>
                <strong>Description:</strong>{" "}
                {book.description
                  ? book.description.value.toString()
                  : book.subtitle}
              </p>
            )}
          </div>
        ))
      ) : (
        <p>Your shelf is empty.</p>
      )}
    </div>
  );
};

export default Shelf;
