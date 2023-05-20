// import { Link } from 'react-router-dom';
import PopularBooks from "./popularBooks";
import Searchbox from "./Searchbar"
import Navbar from "./Navbar"


export default function Home() {
  return (
    <div>
      <Navbar />
      <Searchbox />
      <PopularBooks />
      {/* <Link to="/book/123">View Book Details</Link> */}
    </div>
  );
}