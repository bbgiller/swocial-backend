import { Database } from "../../../lib/types";

const acceptConnectionRequest = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
) => {
  const { authID, connectedAuthID } = args;
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could Not Locate User");
  }
  if (!user.incomingFriendRequests.includes(connectedAuthID)) {
    throw new Error("You don't have a connection request from this user");
  }
  await db.users.findOneAndUpdate(
    { authID },
    {
      $pull: { incomingFriendRequests: connectedAuthID },
      $push: { followers: connectedAuthID },
    },
    function error(err) {
      if (err) {
        throw err;
      }
    }
  );
  await db.users.findOneAndUpdate(
    { authID: connectedAuthID },
    { $pull: { outgoingFriendRequests: authID }, $push: { following: authID } },
    function error(err) {
      if (err) {
        throw err;
      }
    }
  );
  return await user;
};

export default acceptConnectionRequest;
