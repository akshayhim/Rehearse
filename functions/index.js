import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as functions from 'firebase-functions';

const app = express();
const nodeServerPort = 3000;
const babelCorsServerPort = 4000;

app.use(cors());

app.get('/searchresults', async (req, res) => {
  try {
    const { query, type } = req.query;
    let response;
    if (type === 'book') {
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
  } catch (error) {
    console.log('Error searching:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start your Node server
app.listen(nodeServerPort, () => {
  console.log(`Node server is running on port ${nodeServerPort}`);
});

// Start the Babel/CORS server
app.use(
  '/',
  createProxyMiddleware({
    target: `http://localhost:${nodeServerPort}`,
    changeOrigin: true,
  })
);

app.listen(babelCorsServerPort, () => {
  console.log(`Babel/CORS server is running on port ${babelCorsServerPort}`);
});

export const api = functions.https.onRequest(app);