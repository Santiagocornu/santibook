const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { uid, displayName, email } = data;

    if (!uid) return { statusCode: 400, body: "UID is required" };

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

    // Evitar duplicados
    const existing = await collection.findOne({ uid });
    if (existing) {
      return { statusCode: 200, body: JSON.stringify(existing) };
    }

    const newUser = { uid, displayName: displayName || "", email: email || "" };
    const result = await collection.insertOne(newUser);

    return {
      statusCode: 200,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
