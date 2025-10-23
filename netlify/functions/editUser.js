const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event) {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { uid, displayName, email, photoURL, bio } = JSON.parse(event.body);

    if (!uid) return { statusCode: 400, body: "UID is required" };
    if (!displayName) return { statusCode: 400, body: "displayName is required" };

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

    const filter = { uid };
    const userFound = await collection.findOne(filter);
    if (!userFound) return { statusCode: 404, body: "User not found" };

    // Actualizamos con los campos correctos, incluyendo bio
    const result = await collection.updateOne(filter, {
      $set: {
        displayName,
        email: email || userFound.email || "",
        photoURL: photoURL || userFound.photoURL || "",
        bio: bio || userFound.bio || "",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User updated successfully" }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
