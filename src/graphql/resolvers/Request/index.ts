import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Request, User, Place } from "../../../lib/types";
export const requestResolvers: IResolvers = {
  Query: {
    requests: async (_root: undefined, _args: {}, { db }: { db: Database }) => {
      console.log("here 123");
      return await db.requests.find({}).toArray();
    },
    requestByUserID: async (
      _root: undefined,
      { authID }: { authID: string },
      { db, req }: { db: Database; req: Request }
    ) => {
      const user = db.users.findOne({ authID: authID });

      if (!user) {
        throw new Error("Could not locate user");
      }

      const findRequest = async (requestID: ObjectId) => {
        const req = await db.requests.findOne({ _id: requestID });
        if (!req) {
          throw new Error("could not find request");
        }
        return req;
      };

      const userRequests = user.then((use) => {
        if (use) {
          if (!use.completedRequests) {
            return [];
          }
          const trueRequests = use.completedRequests.map((id) => {
            console.log(id);
            return findRequest(id);
          });
          return trueRequests;
        } else {
          throw new Error("No user requests");
        }
      });

      return userRequests;
    },
    outgoingRequestsByUserID: async (
      _root: undefined,
      { authID }: { authID: string },
      { db, req }: { db: Database; req: Request }
    ) => {
      const user = db.users.findOne({ authID: authID });

      if (!user) {
        throw new Error("Could not locate user");
      }

      const findRequest = async (requestID: ObjectId) => {
        const req = await db.requests.findOne({ _id: requestID });
        if (!req) {
          throw new Error("could not find request");
        }
        return req;
      };

      const userRequests = user.then((use) => {
        if (use) {
          if (!use.outgoingRequests) {
            return [];
          }
          const trueRequests = use.outgoingRequests.map((id) => {
            console.log(id);
            return findRequest(id);
          });
          return trueRequests;
        } else {
          throw new Error("No user requests");
        }
      });

      return userRequests;
    },
    incomingRequestsByUserID: async (
      _root: undefined,
      { authID }: { authID: string },
      { db, req }: { db: Database; req: Request }
    ) => {
      const user = db.users.findOne({ authID: authID });

      if (!user) {
        throw new Error("Could not locate user");
      }

      const findRequest = async (requestID: ObjectId) => {
        const req = await db.requests.findOne({ _id: requestID });
        if (!req) {
          throw new Error("could not find request");
        }
        return req;
      };

      const userRequests = user.then((use) => {
        if (use) {
          if (!use.incompletedRequests) {
            return [];
          }
          const trueRequests = use.incompletedRequests.map((id) => {
            console.log(id);
            return findRequest(id);
          });
          return trueRequests;
        } else {
          throw new Error("No user requests");
        }
      });

      return userRequests;
    },
  },
  Mutation: {
    newRequest: async (_root: undefined, args, { db }: { db: Database }) => {
      const userObjectRequesting = await db.users.findOne({
        authID: args.userRequesting,
      });

      const userObjectRequested = await db.users.findOne({
        authID: args.userRequested,
      });

      if (!userObjectRequesting || !userObjectRequested) {
        throw new Error(
          "Could not find username for either user in transaction"
        );
      }

      const newRequestID = new ObjectId();

      const request: Request = {
        _id: newRequestID,
        createdAt: new Date(),
        userRequesting: args.userRequesting,
        userNameRequesting: userObjectRequesting.userName,
        userRequested: args.userRequested,
        userNameRequested: userObjectRequested.userName,
        requestDescription: args.requestDescription,
        complete: false,
      };

      const newRequest = await db.requests.insertOne(request);
      if (newRequest) {
        db.users.updateOne(userObjectRequesting, {
          $set: {
            outgoingRequests: userObjectRequesting.outgoingRequests.concat(
              newRequestID
            ),
          },
        });
        db.users.updateOne(userObjectRequested, {
          $set: {
            incompletedRequests: userObjectRequested.incompletedRequests.concat(
              newRequestID
            ),
          },
        });
      }
      return request;
    },
  },
  Request: {
    id: ({ _id }) => _id,
  },
};
