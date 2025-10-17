const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async (event) => {
  try {
    const { uid, displayName, title, content } = JSON.parse(event.body);

    if (!uid || !displayName || !title || !content) {
      return { statusCode: 400, body: 'Faltan datos obligatorios' };
    }

    await client.connect();
    const db = client.db('Santibook');
    const collection = db.collection('post');

    const result = await collection.insertOne({
      uid,
      displayName,
      title,
      content,
      createdAt: new Date(),
      type: 'post'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Post creado', id: result.insertedId }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
