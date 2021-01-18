import { prop as Property } from "@typegoose/typegoose";
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
