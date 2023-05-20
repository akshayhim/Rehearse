import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());


app.get('/searchresults', async (req, res) => {
  try {
    const { query, type } = req.query;
    let response;
    if (type === 'book') {
      // console.log("reached here");

      response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&lang=eng`);
      res.json(response.data?.docs || []);
    } else if (type === 'author') {
      const authorResponse = await axios.get(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}`);
      const authorKey = authorResponse.data?.docs[0]?.key;
      if (authorKey) {
        response = await axios.get(`https://openlibrary.org/authors/${authorKey}/works.json`);
        res.json(response.data?.entries || []);
      } else {
        res.json([]);
      }
    } else if (type === 'category') {
      response = await axios.get(`https://openlibrary.org/subjects/${encodeURIComponent(query)}.json`);
      res.json(response.data?.works || []);
    }
    // else if (!type) {
    //   response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&lang=eng`);
    //   res.json(response.data?.docs || []);
    //   console.log("reached here");
    // }
  } catch (error) {
    console.log('Error searching:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
