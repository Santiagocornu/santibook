import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;

export const handler = async (event, context) => {
  try {
    const client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1 },
    });
    await client.connect();

    const db = client.db("Santibook");
    const collection = db.collection("post");
    const posts = await collection.find({}).toArray();

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(posts),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al obtener los posts" }),
    };
  }
};
