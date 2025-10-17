const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const uid = event.queryStringParameters?.uid;
    if (!uid) {
      return { statusCode: 400, body: "Falta el parámetro UID" };
    }

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("posts");

    // Buscar todos los posts del usuario
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
  } finally {
    await client.close();
  }
};
