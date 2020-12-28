import { gql } from "apollo-server-express";

export const accountTypeDefs = gql`
  
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
    login(email: String!, password: String!): LoginResponse
    verification(email: String!, verificationCode: Int!): User
  }
  type User {
    firstName: String
    lastName: String
    email: String
    userId: String
    age: Int!
  }
  type LoginResponse {
    token: String
  }
`;
