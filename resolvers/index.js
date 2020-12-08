import { User } from "../models/users";

export const resolvers = {
  Mutation: {
    createUser: async (root, args, {}) => {
      await User.findOne({ email: args.email }, function (err, newUser) {
        if (newUser) {
          console.log("user already exist");
          return err;
        } else {
          console.log(args);
          const user = User.create(args);
          return user;
        }
      });
    },
  },
  Query: {
    hello: () => "hey",
  },
};
