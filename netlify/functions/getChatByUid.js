// netlify/functions/getChatByUid.js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const uid = event.queryStringParameters.uid;

    if (!uid) {
      return { statusCode: 400, body: "UID is required" };
    }

    await client.connect();
    const db = client.db("Santibook");
    const chatsCollection = db.collection("chats");

    // Buscar todos los chats donde el usuario esté en el array "usuarios"
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
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
