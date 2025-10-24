// /.netlify/functions/getUsers.js
const { MongoClient } = require("mongodb");

exports.handler = async function (event, context) {
  // Revisa la clave enviada en headers
  const apiKey = event.headers['x-api-key']; // el cliente enviará este header
  if (apiKey !== process.env.API_SECRET_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");
    const users = await collection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    if (client) await client.close();
  }
};
