import { Collection, ObjectID } from "mongodb";

export interface User {
  _id: ObjectID;
  createdAt: Date;
  authID: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  deleted: boolean;
}

export interface Database {
  users: Collection<User>;
}
