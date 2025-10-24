const { MongoClient } = require("mongodb");

let client; // reutilizamos la conexión entre invocaciones

exports.handler = async function (event) {
  // Validar método
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const uid = event.queryStringParameters?.uid;
    if (!uid) {
      return { statusCode: 400, body: "Falta el parámetro UID" };
    }

    // Crear cliente solo si no existe
    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("Santibook");
    const collection = db.collection("posts");

    // Buscar posts del usuario
    const posts = await collection.find({ uid }).sort({ createdAt: -1 }).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (error) {
    console.error("Error en getPostsByUid:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno", error: error.message }),
    };
  }
};
