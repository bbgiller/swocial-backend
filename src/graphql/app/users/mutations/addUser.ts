import { ObjectId } from "mongodb";

import { Database, User } from "../../../../lib/types";
export const addUser = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
) => {
  let findUserName = args.firstName.toLowerCase() + args.lastName.toLowerCase();
  const userName = await db.users.findOne({ userName: findUserName });
  if (userName) {
    findUserName = findUserName + "1";
  }
  const user: User = {
    _id: new ObjectId(),
    createdAt: new Date(),
    authID: args.authID,
    firstName: args.firstName[0].toUpperCase() + args.firstName.slice(1),
    lastName: args.lastName[0].toUpperCase() + args.lastName.slice(1),
    userName: findUserName,
    phoneNumber: args.phoneNumber,
    email: args.email,
    deleted: false,
  };

  return await db.users.insertOne(user);
};
