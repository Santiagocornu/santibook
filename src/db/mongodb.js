// mongodb.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://santiagocornuepet20_db_user:Santi2409*@cluster0.d6yfobe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB Atlas");
  } catch (err) {
    console.error(err);
  }
}

module.exports = { client, connectDB };
