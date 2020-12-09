import { User } from "../models/users";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";

export const resolvers = {
  Mutation: {
    createUser: async (root, args, {}) => {
      const existedUser = await User.findOne({ email: args.email });
      if (existedUser) throw new ApolloError("User already exists");
      else {
        const hashedPass = await bcrypt.hash(args.password, 10);
        args.password = hashedPass;
        const user = await User.create(args);
        return user;
      }
    },
  },
  Query: {
    readError: () => "User already exisst",
    getUser: async () => {
      const userById = await User.findById("5fd06ad4ddfca904dc7f8526").exec();
      return userById;
    },
  },
};
