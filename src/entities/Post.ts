import { prop as Property, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "./User";

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
