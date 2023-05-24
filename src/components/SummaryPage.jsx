import { useEffect, useState } from 'react';
import Navbar from './homePage/Navbar'
import './summarypage.css'

const SummaryPage = () => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const storedSummary = localStorage.getItem('summary');
    if (storedSummary) {
      setSummary(storedSummary);
      localStorage.removeItem('summary');
    }
  }, []);

  return (
    <div className='bg'>
      <Navbar />
      <h2 className='sumheading'>BOOK SUMMARY</h2>
      <p className='mainsum'>{summary}</p>
    </div>
  );
};

export default SummaryPage;
