// netlify/functions/getMessages.js
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function handler(event) {
  try {
    const { id, limit = 10, beforeDate } = event.queryStringParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el id del chat" }),
      };
    }

    await client.connect();
    const db = client.db("Santibook"); 
    const chats = db.collection("chats");

    let pipeline;

    if (beforeDate) {
      // Para cargar mensajes anteriores: filtra por date < beforeDate, ordena descendente, limita, y revierte
      pipeline = [
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$content" },
        { $match: { "content.date": { $lt: new Date(beforeDate) } } }, // Solo mensajes anteriores
        { $sort: { "content.date": -1 } },
        { $limit: Number(limit) },
        { $group: { _id: "$_id", content: { $push: "$content" } } }
      ];
    } else {
      // Carga inicial: últimos mensajes
      pipeline = [
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$content" },
        { $sort: { "content.date": -1 } },
        { $limit: Number(limit) },
        { $group: { _id: "$_id", content: { $push: "$content" } } }
      ];
    }

    const result = await chats.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]), // No hay más mensajes
      };
    }

    // Revertir para orden ascendente
    const messages = result[0].content.reverse();

    return {
      statusCode: 200,
      body: JSON.stringify(messages),
    };
  } catch (err) {
    console.error("Error en getMessages:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  } finally {
    await client.close();
  }
}