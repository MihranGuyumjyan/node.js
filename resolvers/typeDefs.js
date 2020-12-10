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
  }
  type User {
    firstName: String
    lastName: String
    email: String
  }
  type LoginResponse {
    token: String
  }
`;
