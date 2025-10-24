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
    const { id, title, content, editado } = JSON.parse(event.body);

    if (!id) return { statusCode: 400, body: JSON.stringify({ message: "ID is required" }) };
    if (!title || !content) return { statusCode: 400, body: JSON.stringify({ message: "Title and content are required" }) };

    const db = await connectToDatabase();
    const collection = db.collection("post");

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const postFound = await collection.findOne(filter);
    if (!postFound) return { statusCode: 404, body: JSON.stringify({ message: "Post not found" }) };

    await collection.updateOne(filter, {
      $set: { title, content, editado: !!editado },
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Post updated successfully" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
