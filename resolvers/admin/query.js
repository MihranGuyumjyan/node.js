import { User } from "../../models/users";
import { checkAdminAuth } from '../../helpers/auth';

export const adminQueries = {
  getAllUsers: async (root, {}, { userData }) => {
    checkAdminAuth(userData);

    return await User.find({});
  },
};