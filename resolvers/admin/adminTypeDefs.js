import { gql } from "apollo-server-express";

export const adminTypeDefs = gql`

extend type Mutation {
    adminLogin(login: String!, password: String!): adminLoginResponse
}
type adminLoginResponse {
    token: String
}
extend type Query {
    getAllUsers: [AllUsers]
}
type AllUsers {
    firstName: String
    lastName: String
    email: String
    userId: String
    age: Int
}
`