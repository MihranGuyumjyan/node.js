import { User } from "../../models/users";
import { History } from "../../models/history";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
import { generateToken } from "../../helpers/jwt";

export const accountMutations = {
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
    const date = new Date().toISOString();
    if (!userHistory) {
      await History.create({
        userId: existedUser._id,
        lastLogin: date,
      });
    } else {
      await History.findOneAndUpdate(
        { userId: existedUser._id },
        {
          lastLogin: date,
        }
      );
    }

    return { token: generateToken(existedUser._id.toString()) };
  },
};
