import PopularBooks from "./PopularBooks";
import Searchbox from "./Searchbar"
import Navbar from "./Navbar"
import Footer from "./Footer";
import "./Home.css";
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <div className="landingpg">
      <Navbar />
      <div>
        <h1>kdnnadkjn</h1>
        {/* <h1>Read summaries of books and add them into your shelf</h1> */}
          <Typography variant="h3" component="h1" gutterBottom sx={{ color:"#f5f5f5", textAlign: "center", position: "relative", top: "60px", fontFamily: "'Bodoni Moda', 'serif'", fontWeight: "800" }}>
              Search & read the summary of any book
          </Typography>
          <Typography variant="h6" component="h6" gutterBottom sx={{ color:"#f5f5f5", textAlign: "center", position: "relative", top: "60px", fontFamily: "'Bodoni Moda', 'serif'", fontStyle: 'italic', fontSize: "14px", letterSpacing: "0.8px" }}>
              Get the main ideas/plot of a book quickly, without having to read it fully.
          </Typography>
      </div>
        
      <Searchbox />
      <PopularBooks />
      <Footer />
      {/* <Link to="/book/123">View Book Details</Link> */}
    </div>
  );
}