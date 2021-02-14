import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { isAuth } from "../auth";
import { LoginResponse } from "../entities/LoginResponse";
import { User } from "../entities/User";
import { UserModel } from "../models";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { DocumentType } from "@typegoose/typegoose";
import { DocumentQuery } from "mongoose";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  members(): DocumentQuery<DocumentType<User>[], DocumentType<User>, {}> {
    return UserModel.find();
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async currentUser(
    @Ctx() { payload }: MyContext
  ): Promise<DocumentType<User> | null> {
    try {
      return await UserModel.findById(payload!.userId).exec();
    } catch {
      throw new Error("Invalid accessToken.");
    }
  }

  @Query(() => User)
  async getUserById(@Arg("_id") _id: string) {
    try {
      return await UserModel.findById(_id).exec();
    } catch {
      throw new Error("Invalid ID.");
    }
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    try {
      const hashedPassword = await hash(password, 12);
      await UserModel.create({
        firstName: firstName,
        lastName: lastName,
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
      throw new Error("Could not find that email.");
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
  ): Promise<boolean> {
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
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateName(
    @Arg("_id") _id: string,
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    if (payload!.userId !== _id) {
      throw new Error("invalid token");
    }

    try {
      await UserModel.findByIdAndUpdate(_id, {
        firstName: firstName,
        lastName: lastName,
      });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateBio(
    @Arg("bio") bio: string,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    if (!payload) {
      throw new Error("invalid token");
    }

    try {
      await UserModel.findByIdAndUpdate(payload.userId, { bio: bio });
    } catch (err) {
      console.error.bind(err);
      return false;
    }
    return true;
  }
}
