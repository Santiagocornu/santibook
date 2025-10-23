const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { postId, uid, displayName, photoURL, content } = JSON.parse(event.body);

    if (!postId || !uid || !content) {
      return { statusCode: 400, body: "postId, uid y content son requeridos" };
    }

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("post");

    // Creamos el comentario
    const newComment = {
      uid,
      displayName: displayName || "Usuario",
      photoURL: photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content,
      createdAt: new Date(),
    };

    // Actualizamos el post agregando el comentario
    const result = await collection.updateOne(
      { _id: new ObjectId(postId) },
      { $push: { comentarios: newComment } }
    );

    if (result.modifiedCount === 0) {
      return { statusCode: 404, body: "Post no encontrado" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Comentario agregado", comment: newComment }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
