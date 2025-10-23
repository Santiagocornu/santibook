// netlify/functions/addMessage.js
const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { chatId, contenido, uid } = JSON.parse(event.body);

    if (!chatId || !contenido || !uid) {
      return { statusCode: 400, body: "chatId, contenido and uid are required" };
    }

    await client.connect();
    const db = client.db("Santibook");
    const chatsCollection = db.collection("chats");

    const message = {
      contenido,
      uid,
      date: new Date(),
    };

    // Agregar mensaje al array content
    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(chatId) },
      { $push: { content: message } }
    );

    if (result.modifiedCount === 0) {
      return { statusCode: 404, body: "Chat not found" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message added successfully" }),
    };
  } catch (error) {
    console.error("Error adding message:", error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
