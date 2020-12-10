import { ApolloError } from "apollo-server-express";
import { User } from "../../models/users";

export const accountQueries = {
  getUser: async (root, {}, { userData }) => {
    if (!userData || !userData.userId) throw new ApolloError("Unauthorized");
    return await User.findById(userData.userId).exec();
  },
  addAge: async (root, setAge, { userData }) => {
    if (!userData || !userData.userId) throw new ApolloError("Unauthorized");
    return await User.findByIdAndUpdate(userData.userId, {
      age: setAge.setAge,
    });
  },
};
