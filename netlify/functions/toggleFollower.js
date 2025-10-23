// netlify/functions/toggleFollower.js
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

exports.handler = async function (event) {
  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { uid, followerUid } = JSON.parse(event.body);

    if (!uid || !followerUid) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Both uid and followerUid are required" }),
      };
    }

    await client.connect();
    const db = client.db("Santibook");
    const collection = db.collection("users");

    const user = await collection.findOne({ uid });
    if (!user) {
      return {
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const isFollowing = user.followers?.includes(followerUid);
    const updateOperation = isFollowing
      ? { $pull: { followers: followerUid } }
      : { $addToSet: { followers: followerUid } };

    const result = await collection.updateOne({ uid }, updateOperation);

    if (result.modifiedCount === 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "No changes made" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: isFollowing
          ? "Follower removed successfully"
          : "Follower added successfully",
        isFollowing: !isFollowing,
      }),
    };
  } catch (error) {
    console.error("Error in toggleFollower:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: error.message || "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
};
