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
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const { uid1, uid2 } = JSON.parse(event.body);

    if (!uid1 || !uid2) {
      return { statusCode: 400, body: JSON.stringify({ message: "Both user IDs (uid1, uid2) are required" }) };
    }

    const db = await connectToDatabase();
    const chatsCollection = db.collection("chats");

    // Verificar si ya existe un chat entre los dos usuarios
    const existingChat = await chatsCollection.findOne({
      usuarios: { $all: [uid1, uid2] },
    });

    if (existingChat) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Chat already exists",
          chat: existingChat,
        }),
      };
    }

    // Crear chat vacío
    const newChat = {
      usuarios: [uid1, uid2],
      content: [],
      createdAt: new Date(),
    };

    const result = await chatsCollection.insertOne(newChat);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Chat created successfully",
        chatId: result.insertedId,
      }),
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
