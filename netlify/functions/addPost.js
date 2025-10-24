const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  // Verifica la API Key al inicio
  const apiKey = event.headers["x-api-key"] || event.headers["X-API-Key"];
  const expectedKey = process.env.API_SECRET_KEY;

  if (!apiKey || apiKey !== expectedKey) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "API Key inválida" }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const { uid, displayName, photoURL, title, content, type } = JSON.parse(event.body);

    // Validar datos obligatorios
    if (!uid || !displayName || !title || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Faltan datos obligatorios" }),
      };
    }

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("post");

    const newPost = {
      uid,
      displayName,
      photoURL: photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      title,
      content,
      createdAt: new Date(),
      type: type || "post",
      editado: false,
    };

    const result = await collection.insertOne(newPost);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Post creado correctamente",
        post: { ...newPost, _id: result.insertedId },
      }),
    };
  } catch (err) {
    console.error("Error creando post:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  } finally {
    await client.close();
  }
};