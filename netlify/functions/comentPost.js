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

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const { postId, uid, displayName, photoURL, content } = JSON.parse(event.body);

    if (!postId || !uid || !content) {
      return { statusCode: 400, body: JSON.stringify({ message: "postId, uid y content son requeridos" }) };
    }

    const db = await connectToDatabase();
    const collection = db.collection("post");

    const newComment = {
      uid,
      displayName: displayName || "Usuario",
      photoURL: photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content,
      createdAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comentarios: newComment } }
    );

    if (result.modifiedCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "Post no encontrado" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Comentario agregado", comment: newComment }),
    };
  } catch (error) {
    console.error("Error en comentPost:", error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
