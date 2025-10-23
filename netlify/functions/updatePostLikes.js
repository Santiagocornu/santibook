
import { MongoClient, ObjectId } from "mongodb";

export const handler = async (event) => {
  try {
    const { id, likes } = JSON.parse(event.body);

    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db("Santibook");

    await db.collection("post").updateOne(
      { _id: new ObjectId(id) },
      { $set: { likes } }
    );

    client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
