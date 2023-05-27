import { useEffect, useState } from "react";
import { CircularProgress, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { sendMessageToChatGPT } from '../api';
import Navbar from "./homePage/Navbar";
import './bookdetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Initialize isLoading as false
  const navigate = useNavigate();

  const generateSummary = async (book) => {
    const prompt = `Generate a super long summary of ${book.title} by ${
      authors.map((author) => author.name).join(", ")
    }`;
    try {
      setIsLoading(true); // Set isLoading to true when starting summary generation
      const response = await sendMessageToChatGPT(prompt);
      const summary = response.trim();
     
      localStorage.setItem('summary', summary); 
      navigate('/summarypage'); 
    } catch (error) {
      console.log('Error generating summary:', error);
    } finally {
      setIsLoading(false); // Set isLoading to false when summary generation is complete
    }
  };

  const handleSnackbarClose = () => {
    console.log("Snackbar close button clicked");
    setIsSnackbarOpen(false);
  };

  const addToShelf = async (bookId) => {
    console.log("Add to shelf button clicked"); 
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
      <button onClick={() => generateSummary(book)} className="styleButton">
        Generate Summary
      </button>
      <button onClick={handleAddToShelf} className="styleButton">
        Add to Shelf
      </button>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Book added to shelf!
        </Alert>
      </Snackbar>
      {isLoading && (
        <div className="loading-overlay">
          <CircularProgress />
          <p>Generating summary for this book</p>
          <p className="small">This may take some time</p>  
        </div>
      )}
    </div>
  );
};

export default BookDetails;
