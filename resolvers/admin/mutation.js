import { ApolloError } from "apollo-server-express";
import { Admin } from "../../models/admins";
import { generateAdminToken } from "../../helpers/jwt";

export const adminMutations = {
  adminLogin: async (root, args, {}) => {
    const { login, password } = args;

    const existedAdmin = await Admin.findOne({ login });
    if (!existedAdmin) throw new ApolloError("Admin not found");
    
    if (password !== existedAdmin.password) throw new ApolloError("incorrect password");
    
    return { token: generateAdminToken(existedAdmin.adminId) };
  },
};
