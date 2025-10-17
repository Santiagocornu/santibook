const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event) {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    
    const { id } = event.queryStringParameters || {};

    if (!id) return { statusCode: 400, body: "ID is required" };

    console.log("Deleting post with id:", id);

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("post"); 

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log("Delete result:", result);

    if (result.deletedCount === 0) return { statusCode: 404, body: "Post not found" };

    return { statusCode: 200, body: JSON.stringify({ message: "Post deleted successfully" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  } finally {
    await client.close();
  }
};
