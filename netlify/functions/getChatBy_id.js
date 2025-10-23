import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO_URI;

// 🔁 Reusar conexión para no cerrarla en cada request
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  const db = cachedClient.db("Santibook");
  cachedDb = db;
  return db;
}

export const handler = async (event) => {
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

    // Verificamos que el ID sea válido antes de buscar
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const chat = await collection.findOne(filter);

    console.log("Resultado de búsqueda:", chat);

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
