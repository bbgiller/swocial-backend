import { Collection, ObjectID } from "mongodb";

export interface Place {
  _id: ObjectID;
  createdAt: Date;
  googlePlaceID: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  userAuthID: string;
  category: string;
  description: string;
  tags: string[];
  usersSaved: string[];
}

export interface User {
  _id: ObjectID;
  createdAt: Date;
  authID: string;
  firstName: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  hometown: string;
  places: string[];
  savedPlaces: string[];
  outgoingFriendRequests: string[];
  incomingFriendRequests: string[];
  followers: string[];
  following: string[];
  newUser: boolean;
  profilePictureURL: string;
  outgoingRequests: ObjectID[];
  incompletedRequests: ObjectID[];
  completedRequests: ObjectID[];
  private: boolean;
  blockedList: string[];
  deleted: boolean;
}

export interface Request {
  _id: ObjectID;
  createdAt: Date;
  userRequesting: string;
  userNameRequesting: string;
  userRequested: string;
  userNameRequested: string;
  requestDescription: string;
  complete: boolean;
}

export interface ZipCode {
  _id: ObjectID;
  zip: string;
  lat: string;
  lng: string;
  city: string;
  state_id: string;
  state_name: string;
}

export interface Database {
  users: Collection<User>;
  places: Collection<Place>;
  requests: Collection<Request>;
  zip_codes: Collection<ZipCode>;
}
