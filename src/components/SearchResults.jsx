import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Searchbox from './homePage/Searchbar';
import Navbar from './homePage/Navbar'
import { Typography } from '@mui/material';

const SearchResults = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    const type = queryParams.get('type');

    const searchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/searchresults', {
          params: { query, type },
        });
        const searchData = response.data;
        setSearchResults(searchData);
        setIsLoading(false);
      } catch (error) {
        console.log('Error searching:', error);
        setIsLoading(false);
      }
    };

    searchBooks();
  }, [location.search]);

  const extractBookId = (key) => {
    const parts = key.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div>
      <Navbar />
      <Searchbox />
      <Typography variant="h5" component="h1" gutterBottom sx={{ color:"#f5f5f5", position: "relative", bottom: "30px", fontFamily: "'Bodoni Moda', 'serif'", fontWeight: 600, textDecoration: "underline" }}>
      Search Results
          </Typography>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {searchResults && searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div key={result.key} style={{color: "white"}}>
                <h3>
                  <Link to={`/book/${extractBookId(result.key)}`} style={{color: "white"}} >{result.title}</Link>
                </h3>
                {result.author_name && (
                  <p>
                    <strong>Author:</strong> {result.author_name.join(', ')}
                  </p>
                )}
                {result.first_publish_year && (
                  <p>
                    <strong>First Publish Year:</strong> {result.first_publish_year}
                  </p>
                )}
                <hr />
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
