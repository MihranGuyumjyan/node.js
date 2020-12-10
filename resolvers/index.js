import { accountQueries, accountMutations } from "./account";

export const resolvers = {
  Mutation: {
    ...accountMutations,
  },
  Query: {
    ...accountQueries,
  },
};
