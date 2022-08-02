import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, User, Place } from "../../../lib/types";
import {
  userByAuthID,
  getUserPlaceIds,
  // userAuthIdToPlaces,
  // userAuthIdToSavedPlaces,
  userAuthIdToFollowRequests,
  returnFollowingWhoHavePlace,
} from "../../app/users/users";
import loadUserPlaces from "../../app/places/loadUserPlaces";
import loadUserSavedPlaces from "../../app/places/loadUserSavedPlaces";
import togglePrivacy from "../../app/users/togglePrivacy";
import addToBlockList from "../../app/users/addToBlockList";
import sendConnectionRequest from "../../app/users/sendConnectionRequest";
import declineConnectionRequest from "../../app/users/declineConnectionRequest";
import acceptConnectionRequest from "../../app/users/acceptConnectRequest";
import userExists from "../../app/users/userExists";
import renderUserBlockList from "../../app/users/renderUserBlockList";
import unBlockUser from "../../app/users/unBlockUser";
import userAuthIdToConnections from "../../app/users/userAuthIdToConnections";
import toggleNewUser from "../../app/users/toggleNewUser";
import findZipCode from "../../app/users/findZipCode";
import loadFollowingPlaces from "../../app/places/loadFollowingPlaces";
//parent, args, context, info
export const userResolvers: IResolvers = {
  Query: {
    users: async (_root: undefined, args, { db }: { db: Database }) => {
      const { authID } = args;
      const currentUser = await db.users.findOne({ authID });
      if (!currentUser) {
        throw new Error("Could not find user");
      }
      const userArray = await db.users.find({}).toArray();
      return userArray.filter(
        (user) =>
          !currentUser.blockedList.includes(user.authID) &&
          user.deleted === false &&
          user.authID !== authID
      );
    },
    userByAuthID,
    // userAuthIdToPlaces,
    loadUserPlaces,
    loadUserSavedPlaces,
    // userAuthIdToSavedPlaces,
    getUserPlaceIds,
    userAuthIdToConnections,
    userAuthIdToFollowRequests,
    returnFollowingWhoHavePlace: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      const findUser = async (authID: string) => {
        const use = await db.users.findOne({
          authID,
        });
        if (use) {
          return use;
        } else {
          throw new Error("could not find user connection");
        }
      };

      const places = await db.places.find({
        googlePlaceID: args.googlePlaceID,
      });
      if (!places) {
        throw new Error("Could not find any places with given google place id");
      }

      //placeusers is array of authids of those who have that google placeid
      const placeUsers = [] as authIDDescription[];

      interface authIDDescription {
        authID: string;
        description: string;
      }

      await places.forEach((place) => {
        // placeUsers.push(place.userAuthID);
        const userDescrip: authIDDescription = {
          authID: place.userAuthID,
          description: place.description,
        };
        placeUsers.push(userDescrip);
      });

      const user = await db.users.findOne({ authID: args.authID });
      if (!user) {
        throw new Error("Could not find user");
      }

      interface userDescription {
        user: Promise<User>;
        description: string;
      }

      const following = user.following.concat(user.authID);
      const matchingFollowers = [] as userDescription[];

      placeUsers.forEach((placeUser) => {
        if (following.includes(placeUser.authID)) {
          const finalUserDescription: userDescription = {
            user: findUser(placeUser.authID),
            description: placeUser.description,
          };
          matchingFollowers.push(finalUserDescription);
        }
      });

      return matchingFollowers;
    },

    savedPlaceInUser: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      const user = await db.users.findOne({ authID: args.authID });

      if (!user) {
        throw new Error("User could not be found");
      }

      if (!user.savedPlaces.includes(args.placeID)) {
        return false;
      }
      return true;
    },

    userConnectionRequests: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      const findUser = async (authID: string) => {
        const use = await db.users.findOne({
          authID,
        });
        if (use) {
          return use;
        } else {
          throw new Error("could not find user connection");
        }
      };

      const user = await db.users.findOne({ authID: args.authID });

      if (!user) {
        throw new Error("User could not be found");
      }

      const connectionRequests = user.incomingFriendRequests;

      const connectionUsers = connectionRequests.map((authID) =>
        findUser(authID)
      );
      return connectionUsers;
    },
    userExists,
    renderUserBlockList,
    findZipCode,
    loadFollowingPlaces,
  },

  Mutation: {
    addUser: async (_root: undefined, args, { db }: { db: Database }) => {
      let findUserName =
        args.firstName.toLowerCase() + args.lastName.toLowerCase();
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
        hometown: args.hometown,
        email: args.email,
        places: [],
        savedPlaces: [],
        outgoingFriendRequests: [],
        incomingFriendRequests: [],
        followers: [],
        following: [],
        newUser: true,
        profilePictureURL: "",
        outgoingRequests: [],
        incompletedRequests: [],
        completedRequests: [],
        private: true,
        blockedList: [],
        deleted: false,
      };
      console.log("Hit the add user function");
      return await db.users.insertOne(user);
    },
    addPlaceToUser: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      try {
        const user = await db.users.findOne({ authID: args.authID });

        if (!user) {
          throw new Error("User can't be found");
        }

        if (user.places.length > 10) {
          throw new Error(
            "You have more than 10 places! Stay tuned for an update"
          );
        }

        const updatedUser = await db.users.updateOne(user, {
          $set: { places: user.places.concat(args.placeID) },
        });

        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },
    addSavedPlaceToUser: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      console.log("query: 1");

      interface isSavedAndUser {
        user: User;
        isSaved: boolean;
      }

      try {
        const user = await db.users.findOne({ authID: args.authID });
        console.log("query 2");

        if (!user) {
          throw new Error("User can't be found");
        }
        console.log("hit the saved places query");

        // user.currentLocation = "12";

        if (!user.savedPlaces.includes(args.placeID)) {
          const updatedUser = await db.users.updateOne(user, {
            $set: { savedPlaces: user.savedPlaces.concat(args.placeID) },
          });
          if (updatedUser) {
            const userSave: isSavedAndUser = {
              user: user,
              isSaved: true,
            };
            return userSave;
          }
        } else {
          const updatedUser = await db.users.updateOne(user, {
            $set: {
              savedPlaces: user.savedPlaces.filter((placeID) => {
                placeID != args.placeID;
              }),
            },
          });
          if (updatedUser) {
            const userSave: isSavedAndUser = {
              user: user,
              isSaved: false,
            };
            return userSave;
          }
        }
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },
    addProfilePictureToUser: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      try {
        const user = await db.users.findOne({ authID: args.authID });
        if (!user) {
          throw new Error("User can't be found");
        }

        // user.currentLocation = "12";
        const updatedUser = await db.users.updateOne(user, {
          $set: { profilePictureURL: args.profilePictureURL },
        });

        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },

    patchNewUserStatus: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      try {
        const user = await db.users.findOne({ authID: args.authID });
        if (!user) {
          throw new Error("User can't be found");
        }

        const updatedUser = await db.users.updateOne(user, {
          $set: { newUser: false },
        });

        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },

    sendFollowRequest: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      console.log("query: 1");

      const user = await db.users.findOne({ authID: args.authID });
      console.log("query 2");

      if (!user) {
        throw new Error("User can't be found");
      }

      const connectedUser = await db.users.findOne({
        authID: args.connectedAuthID,
      });

      if (!connectedUser) {
        throw new Error("User can't be found");
      }

      if (user.following.includes(connectedUser.authID)) {
        throw new Error(`You are already following ${connectedUser.userName}`);
      }
      if (
        user.outgoingFriendRequests.includes(connectedUser.authID) ||
        connectedUser.incomingFriendRequests.includes(user.authID)
      ) {
        throw new Error(
          `You have already sent a follow request to ${connectedUser.userName}`
        );
      }

      if (connectedUser.followers.includes(user.authID)) {
        throw new Error(`${connectedUser.userName} is already followed by you`);
      }

      await db.users.updateOne(user, {
        $set: {
          outgoingFriendRequests: user.outgoingFriendRequests.concat(
            args.connectedAuthID
          ),
        },
      });

      await db.users.updateOne(connectedUser, {
        $set: {
          incomingFriendRequests: connectedUser.incomingFriendRequests.concat(
            args.authID
          ),
        },
      });

      return connectedUser;
    },

    acceptFollowRequest: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      const user = await db.users.findOne({ authID: args.authID });

      if (!user) {
        throw new Error("User can't be found");
      }
      const connectedUser = await db.users.findOne({
        authID: args.connectedAuthID,
      });

      if (!connectedUser) {
        throw new Error("User can't be found");
      }

      // if accepted, add connected auth id to followers and delete auth id from incoming requests, delete outgoing request from connected auth id
      if (args.accepted === true) {
        const newFriendList = user.incomingFriendRequests.filter(
          (authID) => authID !== connectedUser.authID
        );
        await db.users.updateOne(user, {
          $set: {
            followers: user.followers.concat(connectedUser.authID),
            incomingFriendRequests: newFriendList,
          },
        });

        //delete auth ID from connected outgoing requests
        const newOutgoing = connectedUser.outgoingFriendRequests.filter(
          (authID) => authID !== user.authID
        );
        await db.users.updateOne(connectedUser, {
          $set: {
            outgoingFriendRequests: newOutgoing,
            following: connectedUser.following.concat(user.authID),
          },
        });
      }

      if (args.accepted === false) {
        const newIncoming = user.incomingFriendRequests.filter(
          (authID) => authID !== args.connectedAuthID
        );
        const newOutgoing = connectedUser.outgoingFriendRequests.filter(
          (authID) => authID !== args.authID
        );
        await db.users.updateOne(user, {
          $set: {
            incomingFriendRequests: newIncoming,
          },
        });
        await db.users.updateOne(connectedUser, {
          $set: {
            outgoingFriendRequests: newOutgoing,
          },
        });
      }
      return connectedUser;
    },
    patchUser: async (
      _root: undefined,
      args,
      { db, req }: { db: Database; req: Request }
    ) => {
      const user = await db.users.findOne({ authID: args.authID });
      if (!user) {
        throw new Error("User can't be found");
      }

      await db.users.updateOne(user, {
        $set: {
          firstName: args.firstName,
          lastName: args.lastName,
          userName: args.userName,
          hometown: args.hometown,
        },
      });

      return user;
    },
    togglePrivacy,
    addToBlockList,
    unBlockUser,
    sendConnectionRequest,
    declineConnectionRequest,
    acceptConnectionRequest,
    toggleNewUser,
  },

  User: {
    id: (user: User): string => user._id.toString(),
  },
};
