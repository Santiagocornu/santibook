const { MongoClient } = require("mongodb");

let client; 

exports.handler = async function (event, context) {
  // Validar API key
  const apiKey = event.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET_KEY) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  let uid;
  try {
    uid = event.queryStringParameters?.uid;
    if (!uid) {
      console.log("UID no proporcionado");
      return { statusCode: 400, body: "UID is required" };
    }

    if (!client) {
      client = new MongoClient(process.env.MONGO_URI);
      await client.connect();
    }

    const db = client.db("Santibook");
    const collection = db.collection("users");

    const user = await collection.findOne({ uid });

    return {
      statusCode: 200,
      body: JSON.stringify(user || {}),
    };
  } catch (error) {
    console.error("Error en getUserByUid:", error);
    return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
  }
};
