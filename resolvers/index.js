import { User } from "../models/users";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/jwt";

export const resolvers = {
  Mutation: {
    createUser: async (root, args, {}) => {
      const existedUser = await User.findOne({ email: args.email });
      if (existedUser) throw new ApolloError("User already exists");

      const hashedPass = await bcrypt.hash(args.password, 10);
      args.password = hashedPass;
      return await User.create(args);
    },
    login: async (root, args, {}) => {
      const { email, password } = args;

      const existedUser = await User.findOne({ email });
      if (!existedUser) throw new ApolloError("User not found");

      const isValidPassword = bcrypt.compare(password, existedUser.password);
      if (!isValidPassword) throw new ApolloError("incorrect password");

      return { token: generateToken(existedUser._id.toString()) };
    },
  },
  Query: {
    getUser: async (root, {}, { userData }) => {
      if (!userData || !userData.userId) throw new ApolloError("Unauthorised");
      return await User.findById(userData.userId).exec();
    },
  },
};
