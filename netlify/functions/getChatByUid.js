const { MongoClient } = require("mongodb");

let client; // reutilizamos conexión entre invocaciones

exports.handler = async (event) => {
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
      return { statusCode: 400, body: "UID is required" };
    }

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("Santibook");
    const chatsCollection = db.collection("chats");

    const chats = await chatsCollection
      .find({ usuarios: { $in: [uid] } })
      .sort({ "content.date": -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(chats),
    };
  } catch (error) {
    console.error("Error getting chats:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
