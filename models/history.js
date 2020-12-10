import { Schema, model } from "mongoose";

const HistorySchema = new Schema({
  userId: { type: String, required: false},
  lastLogin: { type: String, required: false },
});

export const History = model("History", HistorySchema);
