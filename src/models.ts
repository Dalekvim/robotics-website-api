import { getModelForClass } from "@typegoose/typegoose";
import { Comment } from "./entities/Comment";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export const CommentModel = getModelForClass(Comment);
export const PostModel = getModelForClass(Post, {
  schemaOptions: { timestamps: true },
});
export const UserModel = getModelForClass(User);
