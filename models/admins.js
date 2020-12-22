import { Schema, model } from "mongoose";

const AdminSchema = new Schema(
  {
    login: { type: String, required: true },
    password: { type: String, required: true },
    adminId: { type: Number, required: true }
  }
);

export const Admin = model("Admin", AdminSchema);