import { gql } from 'apollo-server-express';

export const typeDefs = gql`
type Query {
    hello: String
}
type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): User
}
type User {
    firstName: String,
    lastName: String,
    email: String
}
`;