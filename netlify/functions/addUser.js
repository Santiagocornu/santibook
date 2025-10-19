const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { uid, displayName, email, photoURL, type, createdAt } = data;

    if (!uid) return { statusCode: 400, body: "UID is required" };

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

    // Evitar duplicados: buscar por UID
    const existing = await collection.findOne({ uid });
    if (existing) {
      return { statusCode: 200, body: JSON.stringify(existing) };
    }

    // Crear nuevo usuario con todos los campos enviados desde Login.jsx
    const newUser = {
      uid,
      displayName: displayName || "",
      email: email || "",
      photoURL: photoURL || "",  
      type: type || "user",  
      createdAt: createdAt || new Date(),  
    };

    const result = await collection.insertOne(newUser);

    // Devolver el usuario creado, incluyendo el _id generado
    return {
      statusCode: 201,
      body: JSON.stringify({ ...newUser, _id: result.insertedId }),
    };
  } catch (error) {
    console.error("Error en addUser:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  } finally {
    await client.close();
  }
};