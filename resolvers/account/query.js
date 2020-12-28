import { User } from "../../models/users";
import { checkAuth } from '../../helpers/auth';

export const accountQueries = {
  getUser: async (root, {}, { userData }) => {
    checkAuth(userData);
    return await User.findOne({ userId: userData.userId }).exec();
  },
  addAge: async (root, setAge, { userData }) => {
    checkAuth(userData);
    return await User.findOneAndUpdate({ userId: userData.userId }, {
      age: setAge.setAge,
    }, {new: true});
  },
};
