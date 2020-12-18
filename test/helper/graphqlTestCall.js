import { graphql } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { accountTypeDefs } from "../../resolvers/account/accountTypeDefs";
import { offerTypeDefs } from "../../resolvers/offer/offerTypeDefs";
import { adminTypeDefs } from "../../resolvers/admin/adminTypeDefs";
import { resolvers } from "../../resolvers/index";

const schema = makeExecutableSchema({ typeDefs: [accountTypeDefs, offerTypeDefs, adminTypeDefs], resolvers });

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
      userData: {
        userId
      },
    },
    variables
  );
};