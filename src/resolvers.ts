import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { commentModel, userModel } from "./models";
import { Comment, User } from "./types";
import { hash } from "bcrypt";

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  comments() {
    return commentModel.find();
  }
  @Mutation(() => Comment)
  async postComment(@Arg("content") content: string): Promise<Comment> {
    const newComment = new commentModel({ content });
    return await newComment.save();
  }
  @Mutation(() => Boolean)
  async deleteComment(@Arg("_id") _id: string): Promise<boolean> {
    try {
      await commentModel.deleteOne({ _id: _id });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}

@Resolver()
export class MemberResolver {
  @Query(() => [User])
  members() {
    return userModel.find();
  }
  @Mutation(() => Boolean)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await userModel.create({
        username: username,
        email: email,
        password: hashedPassword,
      });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}
