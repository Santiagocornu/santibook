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
    return { statusCode: 405, body: JSON.stringify({ message: "Method Not Allowed" }) };
  }

  try {
    const data = JSON.parse(event.body);
    const { uid, displayName, email, photoURL, type, createdAt } = data;

    if (!uid) {
      return { statusCode: 400, body: JSON.stringify({ message: "UID is required" }) };
    }

    const db = await connectToDatabase();
    const collection = db.collection("users");

    // Evitar duplicados
    const existing = await collection.findOne({ uid });
    if (existing) {
      return { statusCode: 200, body: JSON.stringify(existing) };
    }

    const newUser = {
      uid,
      displayName: displayName || "",
      email: email || "",
      photoURL: photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      type: type || "user",
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    const result = await collection.insertOne(newUser);

    return {
      statusCode: 201,
      body: JSON.stringify({ ...newUser, _id: result.insertedId }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    console.error("Error en addUser:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
