import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { collection, doc, setDoc } from "firebase/firestore";
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

      const userRef = doc(db, "users", user.uid);
      const shelfCollectionRef = collection(userRef, "Shelf");

      // Create the shelf sub-collection and add the bookId document
      await setDoc(doc(shelfCollectionRef, bookId), { bookId });

      console.log("Book added to shelf successfully!");
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
              {book.description && typeof book.description !== "string"
                ? book.description.value.toString()
                : book.description || book.subtitle}
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
