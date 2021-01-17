import { getModelForClass } from "@typegoose/typegoose";
import { Comment, Post, User } from "./entities";

export const CommentModel = getModelForClass(Comment);
export const PostModel = getModelForClass(Post);
export const UserModel = getModelForClass(User);
