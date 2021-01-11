import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}

@ObjectType({ description: "The comment model" })
export class Comment {
  @Field(() => ID)
  _id: string;

  @Field({ description: "The content of the comment" })
  content: string;
}

@ObjectType({ description: "The user model" })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  // @Field()
  password: string;

  @Field()
  bio: string;
}
