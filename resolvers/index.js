import { accountQueries, accountMutations } from "./account";
import { offerMutations, offerQueries } from "./offer";

export const resolvers = {
  Mutation: {
    ...accountMutations,
    ...offerMutations
  },
  Query: {
    ...accountQueries,
    ...offerQueries
  },
};
