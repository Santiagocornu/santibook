const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event) {
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { id, title, content, editado } = JSON.parse(event.body);

    if (!id) return { statusCode: 400, body: "ID is required" };
    if (!title || !content) return { statusCode: 400, body: "Title and content are required" };

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("post"); 
    let filter;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { "_id.$oid": id };
    }

    const postFound = await collection.findOne(filter);
    if (!postFound) return { statusCode: 404, body: "Post not found" };

    const result = await collection.updateOne(filter, {
      $set: { title, content, editado: !!editado },
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Post updated successfully" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
