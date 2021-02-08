import { isAuth } from "../auth";
import { Comment } from "../entities/Comment";
import { CommentModel, UserModel } from "../models";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { DocumentQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  comments(): DocumentQuery<DocumentType<Comment>[], DocumentType<Comment>> {
    return CommentModel.find();
  }

  @Mutation(() => Comment)
  async createComment(@Arg("content") content: string): Promise<Comment> {
    return await CommentModel.create({ content });
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("_id") _id: string,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    try {
      // Checks if payload containing userId is present.
      if (!payload) {
        throw new Error("no payload");
      }

      const user = await UserModel.findById(payload.userId).exec();
      if (!user) {
        throw new Error("only admin can delete comments");
      }
      if (!user.isAdmin) {
        return false;
      }
      await CommentModel.findByIdAndDelete(_id);
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}
