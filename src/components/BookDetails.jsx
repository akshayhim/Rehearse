import { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { sendMessageToChatGPT } from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from "./homePage/Navbar"
import './bookdetails.css'

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const generateSummary = async (book) => {
    const prompt = `Generate a super long summary of ${book.title} by ${
      authors.map((author) => author.name).join(", ")
    }`;
    try {
      const response = await sendMessageToChatGPT(prompt);
      const summary = response.trim();
     
      localStorage.setItem('summary', summary); 
      navigate('/summarypage'); 
    } catch (error) {
      console.log('Error generating summary:', error);
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const addToShelf = async (bookId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const shelfCollectionRef = collection(userRef, "Shelf");

      
      await setDoc(doc(shelfCollectionRef, bookId), { bookId });

      console.log("Book added to shelf successfully!");
      setIsSnackbarOpen(true);
    } catch (error) {
      console.log("Error adding book to shelf:", error);
    }
  };

  const handleAddToShelf = () => {
    addToShelf(id);
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://openlibrary.org/works/${id}.json`
        );
        const bookData = response.data;
        setBook(bookData);

        if (bookData.authors && bookData.authors.length > 0) {
          const authorRequests = bookData.authors.map((author) =>
            axios.get(`https://openlibrary.org${author.author.key}.json`)
          );

          const authorResponses = await Promise.all(authorRequests);
          const authorData = authorResponses.map((response) => response.data);
          setAuthors(authorData);
        }
      } catch (error) {
        console.log("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  return (
    <div className="blockBook">
      <Navbar />
      {/* <h1>Book Details</h1> */}
      {book ? (
        <div>
          {book.covers && book.covers.length > 0 && (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
              alt="Book Cover"
              className="book-photo"
            />
          )}
          <h2 className="bookTitle">{book.title}</h2>
          {authors.length > 0 && (
            <div>
              <p className="bookAuthor">
                <strong>Written by: </strong>
                {authors.map((author) => author.name).join(", ")}
              </p>
            </div>
          )}
          {book.first_publish_date && (
            <p className="bookAuthor">
              <strong>First Published: </strong>
              {book.first_publish_date}
            </p>
          )}
          {book.description || book.subtitle ? (
            <p className="bookAuthor">
              <strong>Description:</strong>{" "}
              {book.description && typeof book.description !== "string"
                ? book.description.value.toString()
                : book.description || book.subtitle}
            </p>
          ) : null}
        </div>
      ) : (
        <p>Loading book details...</p>
      )}
      <button onClick={() => generateSummary(book)} className="styleButton">Generate Summary</button>
      <button onClick={handleAddToShelf} className="styleButton">Add to Shelf</button>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Book added to shelf!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookDetails;
