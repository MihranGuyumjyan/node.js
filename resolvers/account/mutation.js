import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { ApolloError } from "apollo-server-express";
import { User } from "../../models/users";
import { History } from "../../models/history";
import { generateToken } from "../../helpers/jwt";


export const accountMutations = {
  createUser: async (root, args, {}) => {
    const existedUser = await User.findOne({ email: args.email });
    if (existedUser) throw new ApolloError("User already exists");

    const hashedPass = await bcrypt.hash(args.password, 10);
    args.password = hashedPass;
    const userId = uuidv4();
    
    return await User.create({ ...args, userId });
  },
  login: async (root, args, {}) => {
    const { email, password } = args;

    const existedUser = await User.findOne({ email });
    if (!existedUser) throw new ApolloError("User not found");
    
    const isValidPassword = bcrypt.compare(password, existedUser.password);
    if (!isValidPassword) throw new ApolloError("incorrect password");

    const userHistory = await History.findOne({ userId: existedUser.userId });
    const date = new Date().toISOString();
    if (!userHistory) {
      await History.create({
        userId: existedUser.userId,
        lastLogin: date,
      });
    } else {
      await History.findOneAndUpdate(
        { userId: existedUser.userId },
        {
          lastLogin: date,
        }
      );
    }

    return { token: generateToken(existedUser.userId) };
  },
};
