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

export const handler = async (event) => {
  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const { id } = event.queryStringParameters;
    console.log("ID recibido:", id);

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el parámetro id" }),
      };
    }

    const db = await connectToDatabase();
    const collection = db.collection("chats");

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const chat = await collection.findOne(filter);

    if (!chat) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Chat no encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(chat),
    };
  } catch (error) {
    console.error("Error al obtener chat:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
