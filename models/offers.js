import { Schema, model } from "mongoose";

const OfferSchema = new Schema({
    userId: { Type: String, required: true},
    title: { Type: String, required: true},
    productType: { Type: String, required: true },
    price: { 
        value: { Type: Number, required: true}, 
        currency: { Type: String, required: true } 
    },
    condition: { Type: String, required: true },
    description: { Type: String }
    }, {
    timestamps: true,
  }
);

export const Offer = model("Offer", OfferSchema);
