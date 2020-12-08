import { User } from '../models/users';

export const resolvers = {
  Mutation: {
    createUser: async (root, args, { }) => {
      const user = await User.create(args)
      return user
    },
  },
  Query: {
    hello: () => "hey"
  },
};