import { gql } from "apollo-server-express";

export const offerTypeDefs = gql`
  extend type Query {
    getOffer(
      condition: ProductCondition
      minPrice: Float
      maxPrice: Float
    ): [Offer]
  }
  extend type Mutation {
    createOffer(
      title: String!
      productType: String!
      condition: ProductCondition!
      description: String
      price: InputPrice!
    ): Offer
  }
  enum ProductCondition {
    NEW
    USED
  }
  input InputPrice {
    value: Float!
    currency: ProductCurrency!
  }
  type Price {
    value: Float!
    currency: ProductCurrency!
  }
  enum ProductCurrency {
    USD
    AMD
    EUR
  }
  type Offer {
    title: String!
    productType: String!
    condition: ProductCondition!
    description: String
    price: Price!
    userId: String!
  }
`;
