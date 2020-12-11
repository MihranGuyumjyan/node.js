import { checkAuth } from "../../helpers/auth";
import { Offer } from "../../models/offers"

export const offerMutations = {
  createOffer: async (root, args, { userData }) => {
    checkAuth(userData);
    
    return await Offer.create({ ...args, userId: userData.userId });
  },
};
