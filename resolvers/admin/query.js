import { ApolloError } from "apollo-server-express";
import { User } from "../../models/users";
import { checkAuth } from '../../helpers/auth';

export const adminQueries = {
  getAllUsers: async (root, {}, { userData }) => {
    checkAuth(userData);
    if (!Number.isInteger(userData.userId))
        throw new ApolloError("User dont have enough permissions");

    return await User.find({}).exec();
  },
};