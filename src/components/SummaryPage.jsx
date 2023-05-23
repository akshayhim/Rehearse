import { useEffect, useState } from 'react';
import Navbar from './homePage/Navbar'

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
    <div>
      <Navbar />
      <h2>Book Summary</h2>
      <p>{summary}</p>
    </div>
  );
};

export default SummaryPage;
