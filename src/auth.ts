import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./tsTypes";

// bearer <accessToken>

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.SECRET!);
    context.payload = payload as any;
  } catch (err) {
    console.error.bind(err);
    throw new Error("not authenticated");
  }

  return next();
};
