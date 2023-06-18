import mongoose from "mongoose";
import dotenv from 'dotenv';
// const mongoose = require("mongoose");
// require('dotenv').config();

dotenv.config();
// Replace the following with your MongoDB Atlas connection string
const uri = process.env.MONGO_URI
const db_name = process.env.DB_NAME


export async function connect() {
    mongoose.connect(
        uri,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Connected to MongoDB");
          }
        }
      );
}

export async function createUser2ConvMap(user_id, conv_id, msg_id) {
  const db = client.db(db_name);
  const conv = {
    "user_id": user_id,
    "conv_id": conv_id,
    "last_msg_id": msg_id
}
  const result = await db.collection("user2conv").insertOne(conv);
  console.log(`Conv info for User ${user_id} inserted`);
  return result;
}

export async function findConvByUser(user_id) {
  const db = client.db(db_name);
  const result = await db.collection("user2conv").findOne({ user_id });
  console.log(`Conversation info for user ${user_id} found`);
  return result;
}

export async function updateUser2Conv(user_id, conv_id) {
  const db = client.db(db_name);
  const result = await db.collection("user2conv").updateOne({ user_id }, { $set: { conv_id } });
  console.log(`Conversation id for user ${user_id} updated`);
  return result;
}

export async function deleteUser2Conv(user_id) {
  const db = client.db(db_name);
  const result = await db.collection("user2conv").deleteOne({ user_id });
  console.log(`User ${user} to conversation id mapping deleted`);
  return result;
}
