const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGO_URI);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db("Santibook");
  return cachedDb;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  try {
    const { uid, displayName, email, photoURL, bio } = JSON.parse(event.body);

    if (!uid) return { statusCode: 400, body: "UID is required" };
    if (!displayName) return { statusCode: 400, body: "displayName is required" };

    const db = await connectToDatabase();
    const collection = db.collection("users");

    const filter = { uid };
    const userFound = await collection.findOne(filter);
    if (!userFound) return { statusCode: 404, body: JSON.stringify({ message: "User not found" }) };

    const result = await collection.updateOne(filter, {
      $set: {
        displayName,
        email: email || userFound.email || "",
        photoURL: photoURL || userFound.photoURL || "",
        bio: bio || userFound.bio || "",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User updated successfully" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
