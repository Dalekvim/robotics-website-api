import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  _id: string;
  content: string;
}
const commentSchema: Schema = new Schema({ content: String });
export const commentModel = mongoose.model<IComment>("Comment", commentSchema);

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  bio: String,
});
export const userModel = mongoose.model("User", userSchema);
