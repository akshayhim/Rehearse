import { useEffect, useState } from "react";
import { db, auth } from "./../firebase";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const Shelf = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const booksRef = collection(userRef, "Shelf");
        const booksSnapshot = await getDocs(booksRef);

        const bookIds = booksSnapshot.docs.map((doc) => doc.id);

        // Fetch book details for each book in the shelf
        const bookDataPromises = bookIds.map((bookId) =>
          fetchBookDetails(bookId)
        );

        const bookData = await Promise.all(bookDataPromises);
        const booksWithAuthors = await Promise.all(
          bookData.map(async (book) => {
            if (book.authors && book.authors.length > 0) {
              const authorRequests = book.authors.map((author) =>
                axios.get(`https://openlibrary.org${author.author.key}.json`)
              );

              const authorResponses = await Promise.all(authorRequests);
              const authorData = authorResponses.map(
                (response) => response.data
              );
              return {
                ...book,
                authors: authorData,
              };
            }
            return book;
          })
        );

        setBooks(booksWithAuthors);
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

  const handleRemoveFromShelf = async (bookId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // User not logged in, handle the error
        return;
      }
  
      const userRef = doc(db, "users", user.uid);
      const shelfCollectionRef = collection(userRef, "Shelf");
  
      // Get the document reference for the book
      const querySnapshot = await getDocs(shelfCollectionRef);
      const bookDocRef = querySnapshot.docs.find(
        (doc) => doc.data().bookId === bookId || doc.data().bookId.bookId === bookId
      );
      console.log(bookDocRef);
  
      if (!bookDocRef) {
        console.log("Book not found in shelf!");
        return;
      }
  
      await deleteDoc(bookDocRef.ref);
  
      setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
  
      console.log("Book removed from shelf successfully!");
    } catch (error) {
      console.log("Error removing book from shelf:", error);
    }
  };
  
  if (isLoading) {
    return <p>Loading shelf...</p>;
  }

  return (
    <div>
      <h2>Your Shelf</h2>
      {books.length > 0 ? (
        books
          .filter((book) => book !== null && !book.removed)
          .map((book) => (
            <div key={book.id}>
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
              <button onClick={() => handleRemoveFromShelf(book.id)}>
                Remove from Shelf
              </button>
            </div>
          ))
      ) : (
        <p>Your shelf is empty.</p>
      )}
    </div>
  );
};

export default Shelf;
