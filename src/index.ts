import "reflect-metadata";
import "dotenv/config";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { CommentResolver, MemberResolver } from "./resolvers";

const PORT = process.env.PORT || 5000;
const app = express();

const bootstrap = async () => {
  mongoose.connect(process.env.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );

  const schema = await buildSchema({
    resolvers: [CommentResolver, MemberResolver],
  });
  const apolloServer = new ApolloServer({ schema });
  apolloServer.applyMiddleware({ app });

  app.use(express.static("public"));
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

bootstrap();
