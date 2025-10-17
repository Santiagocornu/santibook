const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event, context) {
  try {
    const { uid } = event.queryStringParameters || {};
    if (!uid) return { statusCode: 400, body: "UID is required" };

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

    const user = await collection.findOne({ uid });

    return {
      statusCode: 200,
      body: JSON.stringify(user || {}),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
