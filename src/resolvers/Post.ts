import { isAuth } from "../auth";
import { Post } from "../entities/Post";
import { PostModel, UserModel } from "../models";
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
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return PostModel.find();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { payload }: MyContext
  ) {
    try {
      const author = await UserModel.findById(payload!.userId).exec();
      if (!author) {
        throw new Error("login to create a post");
      }
      await PostModel.create({ author, title, content });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}
