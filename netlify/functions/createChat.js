// netlify/functions/createChat.js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { uid1, uid2 } = JSON.parse(event.body);

    if (!uid1 || !uid2) {
      return { statusCode: 400, body: "Both user IDs (uid1, uid2) are required" };
    }

    await client.connect();
    const db = client.db("Santibook");
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
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
