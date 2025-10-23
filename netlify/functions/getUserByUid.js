const { MongoClient } = require("mongodb");

exports.handler = async function (event, context) {
  let client; 
  try {
    const { uid } = event.queryStringParameters || {};
    if (!uid) {
      console.log("UID no proporcionado");
      return { statusCode: 400, body: "UID is required" };
    }

    
    client = new MongoClient(process.env.MONGO_URI);
    console.log("Conectando a MongoDB...");
    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

  
    const user = await collection.findOne({ uid });

    if (!user) {
      
      return {
        statusCode: 200,
        body: JSON.stringify({}),
      };
    }

    
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    
    return { statusCode: 500, body: error.message };
  } finally {
    // Cierra la conexión solo si existe
    if (client) {
      await client.close();
    }
  }
};