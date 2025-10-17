// server.js
const express = require('express');
const cors = require('cors');
const { connectDB, client } = require('./db/mongodb');
const { getPosts } = require('../netlify/functions/getPost'); 

const app = express();
app.use(cors()); // permite que React haga peticiones
app.use(express.json());

connectDB(); // conectamos a MongoDB

// Endpoint para obtener posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
