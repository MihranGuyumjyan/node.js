import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers } from "./resolvers";
import { typeDefs } from "./resolvers/typeDefs";
import "./env";
import { connectMongo } from "./db";
import { verifyToken } from "./helpers/jwt";

connectMongo();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    userData: req.headers.authorization
      ? verifyToken(req.headers.authorization)
      : {},
  }),
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log("Now browse to http://localhost:4000" + server.graphqlPath)
);