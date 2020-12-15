import { ApolloServer } from "apollo-server-express";
import express from "express";
import { resolvers } from "./resolvers";
import { accountTypeDefs } from "./resolvers/account/accountTypeDefs";
import { offerTypeDefs } from "./resolvers/offer/offerTypeDefs" 
import "./env";
import { connectMongo } from "./db";
import { verifyToken } from "./helpers/jwt";

connectMongo();
const server = new ApolloServer({
  typeDefs: [accountTypeDefs, offerTypeDefs],
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
