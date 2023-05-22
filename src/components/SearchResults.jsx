import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Searchbox from './homePage/Searchbar'

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get('query');
    const type = queryParams.get('type');

    const searchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/searchresults', {
          params: { query, type },
        });
        const searchData = response.data;
        setSearchResults(searchData);
      } catch (error) {
        console.log('Error searching:', error);
      }
    };

    searchBooks();
  }, []);

  const extractBookId = (key) => {
    const parts = key.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div>
      <Searchbox />
      <h1>Search Results</h1>
      {searchResults && searchResults.length > 0 ? (
        searchResults.map((result) => (
          <div key={result.key}>
            <h3>
              <Link to={`/book/${extractBookId(result.key)}`}>{result.title}</Link>
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
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
