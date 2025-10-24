const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db("Santibook");
  return cachedDb;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const { uid } = JSON.parse(event.body);

    if (!uid) {
      return { statusCode: 400, body: JSON.stringify({ message: "UID is required" }) };
    }

    const db = await connectToDatabase();
    const collection = db.collection("users");

    const result = await collection.deleteOne({ uid });

    if (result.deletedCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "User not found" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
