import "babel-polyfill";
import { graphql } from "graphql";
import { makeExecutableSchema } from "graphql-tools";

import { typeDefs } from "../resolvers/typeDefs";
import { resolvers } from "../resolvers/index";

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const graphqlTestCall = async (
  query,
  variables,
  userId
) => {
  return graphql(
    schema,
    query,
    undefined,
    {
      req: {
        userData: {
          userId
        }
      },
    },
    variables
  );
};