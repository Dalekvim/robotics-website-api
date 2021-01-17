import { prop as Property, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "The comment model" })
export class Comment {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field({ description: "The content of the comment" })
  @Property({ required: true })
  content: string;
}

@ObjectType({ description: "The post model" })
export class Post {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field()
  readonly createdAt: Date;

  @Field(() => User)
  @Property({ ref: () => User, required: true })
  author: Ref<User>;

  @Field()
  @Property({ required: true })
  title: string;

  @Field()
  @Property({ required: true })
  content: string;
}

@ObjectType({ description: "The user model" })
export class User {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true, default: false })
  readonly admin: boolean;

  @Field()
  @Property({ required: true })
  username: string;

  @Field()
  @Property({ required: true, unique: true })
  email: string;

  @Property({ required: true })
  password: string;

  @Field()
  @Property({ default: "Write a bit about yourself here." })
  bio?: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  @Property({ ref: () => User })
  user: Ref<User>;
}
