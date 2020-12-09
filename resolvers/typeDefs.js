import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    readError: String
    getUser: User
  }
  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): User
  }
  type User {
    firstName: String
    lastName: String
    email: String
  }
`;
