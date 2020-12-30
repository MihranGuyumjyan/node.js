import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { ApolloError } from "apollo-server-express";
import { customAlphabet } from "nanoid";
import { User } from "../../models/users";
import { History } from "../../models/history";
import { generateToken } from "../../helpers/jwt";
import { sendMsg } from  "../../helpers/sendGrid";

export const accountMutations = {

  createUser: async (root, args, {}) => {
    const existedUser = await User.findOne({ email: args.email });
    if (existedUser) throw new ApolloError("User already exists");

    const hashedPass = await bcrypt.hash(args.password, 10);
    args.password = hashedPass;
    const userId = uuidv4();
    
    const isVerified = false;
    const nanoid = customAlphabet('1234567890', 6)
    const secretNumber = nanoid()

    sendMsg(args.email, secretNumber)

    return await User.create({ ...args, userId, isVerified, secretNumber });
  },

  verification: async (root, args, {}) => {
    const { email, verificationCode } = args;

    const existedUser = await User.findOne({ email });
    if (!existedUser) throw new ApolloError("User not found");

    if (existedUser.isVerified === true) throw new ApolloError("User already verified")

    if (existedUser.secretNumber !== verificationCode) throw new ApolloError("Wrong verification code")

    await User.updateMany( { email: email }, {
      isVerified: true,
      secretNumber: 0,
    }, {new: true})

    return User.findOne({ email })
  
  },

  login: async (root, args, {}) => {
    const { email, password } = args;

    const existedUser = await User.findOne({ email });
    if (!existedUser) throw new ApolloError("User not found");
    
    const isValidPassword = await bcrypt.compare(password, existedUser.password);
    if (!isValidPassword) throw new ApolloError("incorrect password");

    if (existedUser.isVerified === false) throw new ApolloError("User is not verified")

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
