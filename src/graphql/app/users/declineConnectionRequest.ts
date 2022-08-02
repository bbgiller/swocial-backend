import { Database } from "../../../lib/types";

const declineConnectionRequest = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
) => {
  const { authID, connectedAuthID } = args;
  const user = db.users.findOne({ authID });
  await db.users.findOneAndUpdate(
    { authID },
    {
      $pull: { incomingFriendRequests: connectedAuthID },
    },
    function error(err) {
      if (err) {
        throw err;
      }
    }
  );
  await db.users.findOneAndUpdate(
    { authID: connectedAuthID },
    { $pull: { outgoingFriendRequests: authID } },
    function error(err) {
      if (err) {
        throw err;
      }
    }
  );
  return await user;
};

export default declineConnectionRequest;
