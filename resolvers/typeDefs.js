import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    getUser: User
    addAge(setAge: Int!): User
  }
  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User
    login(
      email: String!
      password: String!
    ): LoginResponse
    createOffer(
      title: String!
      productType: String!
      condition: ProductCondition!
      description: String
      price: InputPrice!
    ): Offer
  }
  type User {
    firstName: String
    lastName: String
    email: String
    userId: String
  }
  type LoginResponse {
    token: String
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
