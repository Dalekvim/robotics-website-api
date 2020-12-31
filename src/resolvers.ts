import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { commentModel } from "./models";
import { Comment } from "./types";

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  async comments() {
    return commentModel.find();
  }
  @Mutation(() => Comment)
  async postComment(@Arg("content") content: string): Promise<Comment> {
    const newComment = new commentModel({ content });
    return await newComment.save();
  }
  @Mutation(() => Boolean)
  async deleteComment(@Arg("_id") _id: string): Promise<boolean> {
    await commentModel.deleteOne({ _id: _id });
    return true;
  }
}
