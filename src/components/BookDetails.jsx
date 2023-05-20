import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [authors, setAuthors] = useState([]);

  const addToShelf = async (bookId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // User not logged in, handle the error
        return;
      }
  
      const shelfCollectionRef = collection(
        db,
        "users",
        user.uid,
        "shelf"
      );
  
      // Check if the shelf sub-collection exists for the user
      const shelfSnapshot = await getDocs(shelfCollectionRef); // Use getDocs() instead of get() method
      if (shelfSnapshot.empty) {
        // Shelf sub-collection doesn't exist, create it
        await addDoc(shelfCollectionRef, { dummyField: "dummyValue" });
      }
  
      // Add the book to the shelf sub-collection
      await addDoc(shelfCollectionRef, { bookId });
  
      console.log("Book added to shelf successfully!");
    } catch (error) {
      console.log("Error adding book to shelf:", error);
    }
  };  

  const handleAddToShelf = () => {
    addToShelf(book.key);
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
    <div>
      <h1>Book Details</h1>
      {book ? (
        <div>
          {book.covers && book.covers.length > 0 && (
            <img
              src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
              alt="Book Cover"
            />
          )}
          <h2>{book.title}</h2>
          {authors.length > 0 && (
            <div>
              <p>
                <strong>Written by: </strong>
                {authors.map((author) => author.name).join(", ")}
              </p>
            </div>
          )}
          {book.first_publish_date && (
            <p>
              <strong>First Published: </strong>
              {book.first_publish_date}
            </p>
          )}
          {book.description || book.subtitle ? (
            <p>
              <strong>Description:</strong>{" "}
              {book.description && book.description.value
                ? book.description.value.toString()
                : book.subtitle}
            </p>
          ) : null}
        </div>
      ) : (
        <p>Loading book details...</p>
      )}
      <button onClick={handleAddToShelf}>Add to Shelf</button>
    </div>
  );
};

export default BookDetails;
