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

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  comments() {
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
      const user = await UserModel.findById(payload!.userId).exec();
      if (!user) {
        throw new Error("only admin can delete comments");
      }
      if (!user.admin) {
        return false;
      }
      await CommentModel.findByIdAndDelete(_id);
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }

  // @Mutation(() => Boolean)
  async updateComment(
    @Arg("_id") _id: string,
    @Arg("content") content: string
  ): Promise<boolean> {
    try {
      await CommentModel.findByIdAndUpdate(_id, { content: content });
    } catch (err) {
      console.error.bind(err);
      return true;
    }
    return true;
  }
}
