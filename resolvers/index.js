import { accountQueries, accountMutations } from "./account";
import { offerMutations } from "./offer";

export const resolvers = {
  Mutation: {
    ...accountMutations,
    ...offerMutations
  },
  Query: {
    ...accountQueries,
  },
};
