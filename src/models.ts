import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  _id: string;
  content: string;
}
const commentSchema: Schema = new Schema({ content: String });
export const commentModel = mongoose.model<IComment>("Comment", commentSchema);
