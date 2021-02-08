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
import { DocumentQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "../entities/User";
import { ObjectId } from "mongodb";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): DocumentQuery<DocumentType<Post>[], DocumentType<Post>> {
    return PostModel.find();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    try {
      // Checks if payload containing userId is present.
      if (!payload) {
        throw new Error("no payload");
      }

      const author = await UserModel.findById(payload.userId).exec();
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("_id") _id: string,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    try {
      if (!payload) {
        throw new Error("no payload");
      }
      await varifyUser(payload, _id);
      await PostModel.findByIdAndDelete(_id).exec();
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("_id") _id: string,
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    try {
      if (!payload) {
        throw new Error("no payload");
      }
      await varifyUser(payload, _id);
      await PostModel.findByIdAndUpdate(_id, { title, content });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}

const varifyUser = async (
  payload: { userId: string },
  _id: string
): Promise<void> => {
  const post = await PostModel.findById(_id);
  if (!post) {
    throw new Error("post not found");
  }
  if (!post.author) {
    throw new Error("posts must have an author");
  }
  const author: User = post.author as User;
  if (!author._id) {
    throw new Error("all users must have a unique id");
  }
  if (((payload.userId as unknown) as ObjectId) != author._id) {
    throw new Error("wrong user");
  }
};
