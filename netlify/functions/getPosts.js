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

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
  }

  // Validar API key (opcional)
  const apiKey = event.headers["x-api-key"];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("post");

    const posts = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(posts),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("Error en getPosts:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al obtener los posts" }),
    };
  }
};
