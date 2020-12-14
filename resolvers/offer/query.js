import { checkAuth } from "../../helpers/auth";
import { Offer } from "../../models/offers";

export const offerQueries = {
  getOffer: async (root, args, { userData }) => {
    checkAuth(userData);
    
    const { condition, minPrice, maxPrice } = args;

    const filter = {};
    if (condition)
        Object.assign(filter, { "condition": condition })

    if (minPrice && maxPrice)
        Object.assign(filter, {"price.value": { $gte: minPrice, $lte: maxPrice}})
    else if (minPrice) 
        Object.assign(filter, {"price.value": { $gte: minPrice}})
    else if (maxPrice) 
        Object.assign(filter, {"price.value": { $lte: maxPrice}})
        
    const offers = await Offer.find(filter)
        
    return offers;
  },
};
