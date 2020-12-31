import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ description: "The comment model" })
export class Comment {
  @Field(() => ID)
  _id: string;

  @Field({ description: "The content of the comment" })
  content: string;
}
