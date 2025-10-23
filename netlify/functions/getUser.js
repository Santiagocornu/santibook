// /.netlify/functions/getUsers.js
const { MongoClient } = require("mongodb");

exports.handler = async function (event, context) {
  let client; // Declara el cliente aquí
  try {
    // Crea una nueva conexión por petición
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
    // Cierra la conexión solo si existe
    if (client) {
      await client.close();
    }
  }
};