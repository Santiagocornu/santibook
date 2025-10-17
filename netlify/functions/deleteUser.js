// netlify/functions/deleteUser.js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { uid } = JSON.parse(event.body);

    if (!uid) {
      return { statusCode: 400, body: "UID is required" };
    }

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

    const result = await collection.deleteOne({ uid });

    if (result.deletedCount === 0) {
      return { statusCode: 404, body: "User not found" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
