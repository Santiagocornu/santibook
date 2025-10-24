import { MongoClient, ObjectId } from "mongodb";

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

export async function handler(event) {
  const { chatId, lastMessageDate } = event.queryStringParameters || {};

  if (!chatId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Falta el chatId" }),
    };
  }

  try {
    const db = await connectToDatabase();
    const chatsCollection = db.collection("chats");

    const chat = await chatsCollection.findOne({ _id: new ObjectId(chatId) });
    if (!chat || !chat.content) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
        headers: { "Content-Type": "application/json" },
      };
    }

    const lastDate = lastMessageDate ? new Date(lastMessageDate) : new Date(0);
    const newMessages = chat.content
      .filter(msg => new Date(msg.date) > lastDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      statusCode: 200,
      body: JSON.stringify(newMessages),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error en checkNewMessages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor", details: error.message }),
    };
  }
}
