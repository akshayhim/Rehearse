import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, FormControl, FormControlLabel, Input, Radio, RadioGroup } from '@mui/material';
// import "./Home.css";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('book');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery) {
      let url = '';
      if (searchType === 'book') {
        url = `/searchresults?type=book&query=${encodeURIComponent(searchQuery)}`;
      } else if (searchType === 'author') {
        url = `/searchresults?type=author&query=${encodeURIComponent(searchQuery)}`;
      } else if (searchType === 'category') {
        url = `/searchresults?type=category&query=${encodeURIComponent(searchQuery)}`;
      }
      navigate(url);
    }
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '50vh', justifyContent: 'center' }}>
        {/* <Typography variant="h4" component="h1" gutterBottom>
          Book Search
        </Typography> */}
        <form onSubmit={handleSearch} >
          <Box sx={{ mb: 2 }}>
            <Input
              sx={{ color: "white" }}
              type="text"
              value={searchQuery}
              onChange={handleChange}
              fullWidth
              placeholder="Search for books, authors, or categories"
            />
          </Box>
          <FormControl component="fieldset" sx={{ color: "white" }}>
            <RadioGroup row value={searchType} onChange={handleSearchTypeChange} >
              <FormControlLabel value="book" control={<Radio sx={{ color:"#f5f5f5", }} /> } label="Book" />
              <FormControlLabel value="author" control={<Radio sx={{ color:"#f5f5f5" }} />} label="Author" />
              <FormControlLabel value="category" control={<Radio sx={{ color:"#f5f5f5" }} />} label="Category" />
            </RadioGroup>
          </FormControl>
          <Button sx={{ backgroundColor:"#a69fff" }} type="submit" variant="contained" color="primary">
            Search
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SearchBar;
