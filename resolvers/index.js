import { User } from "../models/users";
import { History } from "../models/history";
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

      const userHistory = await History.findOne({ userId: existedUser._id });
      const date = new Date();
      if (!userHistory)
        await History.create({ userId: existedUser._id, lastLogin: date.toISOString() });
      await History.findOneAndUpdate(
        { userId: existedUser._id },
        {
          lastLogin: date.toISOString(),
        }
      );

      return { token: generateToken(existedUser._id.toString()) };
    },
  },
  Query: {
    getUser: async (root, {}, { userData }) => {
      if (!userData || !userData.userId) throw new ApolloError("Unauthorized");
      console.log(userData);
      return await User.findById(userData.userId).exec();
    },
    addAge: async (root, setAge, { userData }) => {
      if (!userData || !userData.userId) throw new ApolloError("Unauthorized");
      return await User.findByIdAndUpdate(userData.userId, {
        age: setAge.setAge,
      });
    },
  },
};
