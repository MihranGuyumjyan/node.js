import { ApolloError } from "apollo-server-express";

export const checkAuth = (userData) => {
  if (!userData || !userData.userId) 
    throw new ApolloError("Unauthorized");

  return
};

export const checkAdminAuth = (userData) => {
  if (!userData || !userData.adminId) 
    throw new ApolloError("Unauthorized");

  return
};
