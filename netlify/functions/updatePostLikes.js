const { MongoClient, ObjectId } = require("mongodb");

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
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validar API key (opcional)
  const apiKey = event.headers["x-api-key"];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const { id, likes } = JSON.parse(event.body);

    if (!id || !Array.isArray(likes)) {
      return { statusCode: 400, body: JSON.stringify({ message: "id y likes son requeridos" }) };
    }

    const db = await connectToDatabase();
    const collection = db.collection("post");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { likes } }
    );

    if (result.matchedCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "Post no encontrado" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error("Error en updateLikes:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
