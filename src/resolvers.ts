import "dotenv/config";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { commentModel, userModel } from "./models";
import { Comment, LoginResponse, User } from "./types";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { isAuth } from "./auth";
import { MyContext } from "./tsTypes";

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  comments() {
    return commentModel.find();
  }

  @Mutation(() => Comment)
  async createComment(@Arg("content") content: string): Promise<Comment> {
    const newComment = new commentModel({ content });
    return await newComment.save();
  }

  // @Mutation(() => Boolean)
  async deleteComment(@Arg("_id") _id: string): Promise<boolean> {
    try {
      await commentModel.findByIdAndDelete(_id);
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
      await commentModel.findByIdAndUpdate(_id, { content: content });
    } catch (err) {
      console.error.bind(err);
      return true;
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const member = await userModel.findOne({ email: email });

    if (!member) {
      throw new Error("could not find member");
    }

    const valid = await compare(password, member.password);

    if (!valid) {
      throw new Error("bad password");
    }

    // Login Successful

    return {
      accessToken: sign({ userId: member._id }, process.env.SECRET!, {
        expiresIn: "15m",
      }),
    };
  }

  @Mutation(() => Boolean)
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
      await userModel.findByIdAndUpdate(_id, { username: username });
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
      await userModel.findByIdAndUpdate(_id, { bio: bio });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}
