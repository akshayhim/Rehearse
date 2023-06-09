import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./../firebase";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Navbar from "./homePage/Navbar";
import { Typography } from "@mui/material";
import "./shelf.css";
// import { useNavigate } from 'react-router-dom';
// import { sendMessageToChatGPT } from '../api';

const Shelf = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarOpen = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchShelfBooks = async () => {
    setIsLoading(true); // Set isLoading to true while fetching the shelf books

    try {
      const user = await new Promise((resolve) => {
        onAuthStateChanged(auth, (currentUser) => {
          resolve(currentUser);
        });
      });

      if (!user) {
        setIsLoading(false); // Set isLoading to false if user is not signed in
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const booksRef = collection(userRef, "Shelf");
      const booksSnapshot = await getDocs(booksRef);

      const bookIds = booksSnapshot.docs.map((doc) => doc.id);

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
            const authorData = authorResponses.map((response) => response.data);
            return {
              ...book,
              authors: authorData,
            };
          }
          return book;
        })
      );

      setBooks(booksWithAuthors);
    } catch (error) {
      console.log("Error fetching shelf books:", error);
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching the shelf books
    }
  };

  useEffect(() => {
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

      console.log("Removing book with ID:", bookId);

      if (!bookId) {
        console.log("Book ID is empty or undefined!");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const shelfCollectionRef = collection(userRef, "Shelf");
      const bookDocRef = doc(shelfCollectionRef, bookId);

      await deleteDoc(bookDocRef);

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));

      console.log("Book removed from shelf successfully!");

      window.location.reload(); // Reload the page after removing the book
      handleSnackbarOpen();
    } catch (error) {
      console.log("Error removing book from shelf:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Typography
          variant="h7"
          component="h2"
          gutterBottom
          sx={{
            color: "#f5f5f5",
            position: "relative",
            top: "300px",
            textAlign: "center",
          }}
        >
          Loading shelf...
        </Typography>
      </>
    );
  }

  if (!auth.currentUser) {
    return (
      <>
        <Navbar />
        <Typography
          variant="h7"
          component="h2"
          gutterBottom
          sx={{
            color: "#f5f5f5",
            position: "relative",
            top: "300px",
            textAlign: "center",
          }}
        >
          You must sign in to view your shelf.
        </Typography>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <h2>Your Shelf</h2>
      <div className="book-block">
        {books.length > 0 ? (
          books
            .filter((book) => book !== null && !book.removed)
            .map((book) => {
              console.log("Book:", book);
              const bookId = book.key.split("/").pop();
              return (
                <div key={bookId}>
                  <Link to={`/book/${bookId}`}>
                    <h3 className="bookTitle">{book.title}</h3>
                    {book.covers && book.covers.length > 0 && (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
                        alt="Book Cover"
                        className="book-photo"
                      />
                    )}
                    <p className="bookAuthor">
                      <strong>Written by:</strong>{" "}
                      {book.authors && book.authors.length > 0
                        ? book.authors.map((author) => author.name).join(", ")
                        : "Unknown"}
                    </p>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      color: "#f5f5f5",
                      backgroundColor: "#1b1835",
                    }}
                    onClick={() => handleRemoveFromShelf(bookId)}
                  >
                    Remove from Shelf
                  </Button>
                </div>
              );
            })
        ) : (
          <Typography
            variant="h7"
            component="h2"
            gutterBottom
            sx={{
              color: "#f5f5f5",
              position: "relative",
              top: "220px",
              left:"530px",
              textAlign: "center"
            }}
          >
            Your shelf is empty
          </Typography>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          Book removed from shelf!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Shelf;
