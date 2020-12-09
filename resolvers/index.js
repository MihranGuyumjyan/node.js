import { User } from "../models/users";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";

export const resolvers = {
  Mutation: {
    createUser: async (root, args, {}) => {
      const existedUser = await User.findOne({ email: args.email });
      if (existedUser) throw new ApolloError("User already exist");
      else {
        const hashedPass = await bcrypt.hash(args.password, 10);
        args.password = hashedPass;
        const user = await User.create(args);
        console.log(args);
        return user;
      }
    },
  },
  Query: {
    readError: () => "User already exist",
  },
};
