import { accountQueries, accountMutations } from "./account";
import { offerMutations, offerQueries } from "./offer";
import { adminMutations, adminQueries } from "./admin";

export const resolvers = {
  Mutation: {
    ...accountMutations,
    ...offerMutations,
    ...adminMutations    
  },
  Query: {
    ...accountQueries,
    ...offerQueries,
    ...adminQueries
  },
};
