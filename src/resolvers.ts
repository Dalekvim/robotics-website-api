import "dotenv/config";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { CommentModel, PostModel, UserModel } from "./models";
import { Comment, LoginResponse, Post, User } from "./entities";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { isAuth } from "./auth";
import { MyContext } from "./types";

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

@Resolver()
export class MemberResolver {
  @Query(() => [User])
  members() {
    return UserModel.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await UserModel.create({
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const member = await UserModel.findOne({ email: email });

    if (!member) {
      throw new Error("Could not find that member.");
    }

    const valid = await compare(password, member.password);

    if (!valid) {
      throw new Error("Bad password!");
    }

    // Login Successful

    return {
      accessToken: sign({ userId: member._id }, process.env.SECRET!, {
        expiresIn: "15m",
      }),
      user: member,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async changePassword(
    @Arg("_id") _id: string,
    @Arg("password") password: string,
    @Ctx() { payload }: MyContext
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      if (payload!.userId !== _id) {
        throw new Error("wrong user");
      }
      await UserModel.findByIdAndUpdate(_id, {
        password: hashedPassword,
      });
    } catch (err) {
      console.error.bind(err);
    }
  }

  // @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateUsername(
    @Arg("_id") _id: string,
    @Arg("username") username: string,
    @Ctx() { payload }: MyContext
  ) {
    if (payload!.userId !== _id) {
      throw new Error("invalid token");
    }

    try {
      await UserModel.findByIdAndUpdate(_id, { username: username });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateBio(
    @Arg("_id") _id: string,
    @Arg("bio") bio: string,
    @Ctx() { payload }: MyContext
  ) {
    if (payload!.userId !== _id) {
      throw new Error("invalid token");
    }

    try {
      await UserModel.findByIdAndUpdate(_id, { bio: bio });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}
