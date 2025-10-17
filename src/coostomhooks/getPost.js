
const { client } = require('../../src/db/mongodb');

async function getPosts() {
  const db = client.db("Santibook");
  const collection = db.collection("post");
  const productos = await collection.find({}).toArray(); 
  return productos;
}

module.exports = { getPosts };
