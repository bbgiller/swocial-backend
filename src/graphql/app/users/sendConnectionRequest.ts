import { Database, User } from "../../../lib/types";

const sendConnectionRequest = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
): Promise<User> => {
  const { authID, connectedAuthID } = args;
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could not find user");
  }
  const connectedUser = await db.users.findOne({ authID: connectedAuthID });
  if (!connectedUser) {
    throw new Error(`Could not find user`);
  }
  if (user?.outgoingFriendRequests.includes(connectedAuthID)) {
    throw new Error(
      `You have already tried to connect with ${connectedUser.userName}`
    );
  }
  if (user?.following.includes(connectedAuthID)) {
    throw new Error(`You are already following ${user.userName}`);
  }

  if (!connectedUser?.private) {
    await db.users.findOneAndUpdate(
      { authID: connectedAuthID },
      { $push: { followers: authID } }
    );
    await db.users.findOneAndUpdate(
      { authID },
      { $push: { following: connectedAuthID } }
    );
    return connectedUser;
  }

  await db.users.findOneAndUpdate(
    { authID },
    { $push: { outgoingFriendRequests: connectedAuthID } },
    function (err) {
      if (!err) {
        console.log(
          `${
            (connectedUser.userName, connectedUser.authID)
          } added to outgoing friend requests of ${
            (user.userName, user.authID)
          }`
        );
      }
    }
  );
  await db.users.findOneAndUpdate(
    { authID: connectedAuthID },
    { $push: { incomingFriendRequests: authID } },
    (err) => {
      if (!err) {
        console.log(
          `${
            (user.userName, user.authID)
          } added to incoming friend requests of ${
            (connectedUser.userName, connectedUser.authID)
          }`
        );
      }
    }
  );
  return connectedUser;
};

export default sendConnectionRequest;
