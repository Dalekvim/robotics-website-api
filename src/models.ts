import mongoose, { Schema, model } from "mongoose";
import { IComment, IUser } from "./tsTypes";

const commentSchema: Schema = new Schema({ content: String });
export const commentModel = mongoose.model<IComment>("Comment", commentSchema);

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  bio: { type: String, default: "Write a bit about yourself here." },
});
export const userModel = model<IUser>("User", userSchema);
