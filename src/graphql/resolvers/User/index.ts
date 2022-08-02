import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, User } from "../../../lib/types";
import { userByAuthID } from "../../app/users/queries/users";
import { addUser } from "../../app/users/mutations/addUser";

//parent, args, context, info
export const userResolvers: IResolvers = {
  Query: {
    userByAuthID,
  },

  Mutation: {
    addUser,
  },

  User: {
    id: (user: User): string => user._id.toString(),
  },
};
