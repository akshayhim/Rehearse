import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/homePage/Home';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import SearchResults from './components/SearchResults';
import Account from './components/Account/Accinfo'
import Shelf from './components/Shelf';
import BookDetails from './components/BookDetails';
import SummaryPage from './components/SummaryPage';
import Contact from './components/Contact'
import PasswordReset from './components/Account/PasswordReset'

export default function Routing() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/shelf" element={<Shelf/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/account" element={<Account/>} />
          <Route path="/searchresults" element={<SearchResults/>} />  
          <Route path="/summarypage" element={<SummaryPage />} />  
          <Route path="/contact" element={<Contact />} />  
          <Route path="/passwordreset" element={<PasswordReset />} />  
        </Routes>
      </Router>
    );
}
  