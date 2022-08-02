import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    createdAt: String
    authID: String
    firstName: String
    lastName: String
    userName: String
    email: String
    phoneNumber: String
    deleted: Boolean
  }

  type Query {
    #Users
    users(authID: String): [User!]
    userByAuthID(authID: String!): User!
  }

  type Mutation {
    #Users
    addUser(
      authID: String
      firstName: String
      lastName: String
      userName: String
      email: String
      phoneNumber: String
    ): User!
    patchUser(
      authID: String
      firstName: String
      lastName: String
      userName: String
    ): User!
  }
`;
