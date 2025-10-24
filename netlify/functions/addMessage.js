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
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
  }

  try {
    const { chatId, contenido, uid } = JSON.parse(event.body);

    if (!chatId || !contenido || !uid) {
      return { statusCode: 400, body: JSON.stringify({ message: "chatId, contenido and uid are required" }) };
    }

    const db = await connectToDatabase();
    const chatsCollection = db.collection("chats");

    const message = {
      contenido,
      uid,
      date: new Date(),
    };

    const result = await chatsCollection.updateOne(
      { _id: new ObjectId(chatId) },
      { $push: { content: message } }
    );

    if (result.modifiedCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ message: "Chat not found" }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message added successfully", newMessage: message }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error adding message:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
