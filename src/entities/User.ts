import { prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "The user model" })
export class User {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true, default: false })
  readonly admin: boolean;

  @Field()
  @Property({ required: true })
  firstName: string;

  @Field()
  @Property({ required: true })
  lastName: string;

  @Field()
  @Property({ required: true, unique: true })
  email: string;

  @Property({ required: true })
  password: string;

  @Field()
  @Property({ default: "Write a bit about yourself here." })
  bio?: string;
}
