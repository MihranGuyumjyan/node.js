import { ApolloError } from "apollo-server-express";

export const checkAuth = (userData) => {
  if (!userData || !userData.userId) 
    throw new ApolloError("Unauthorized");

  return
};
