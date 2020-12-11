import { checkAuth } from "../../helpers/auth";
import { Offer } from "../../models/offers";

export const offerQueries = {
  getOffer: async (root, args, { userData }) => {
    checkAuth(userData);

    const { condition, min, max } = args;

    if (condition) return await Offer.find({ condition: condition }).exec();

    if (min && max)
      return await Offer.find({ "price.value": { $gte: min, $lte: max } });
    if (min) return await Offer.find({ "price.value": { $gte: min } });
    if (max) return await Offer.find({ "price.value": { $lte: max } });

    return await Offer.find({});
  },
};
