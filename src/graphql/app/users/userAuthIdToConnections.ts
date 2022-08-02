import { Database } from "../../../lib/types";
import { User } from "../../../lib/types";
const userAuthIdToConnections = async (
  _root: undefined,
  { authID }: { authID: string },
  { db }: { db: Database; req: Request }
) => {
  interface followObject {
    followers: User[];
    following: User[];
  }
  const user = await db.users.findOne({
    authID,
  });
  if (!user) {
    throw new Error("Could not find user");
  }

  const { followers, following } = user;

  const followerList = await db.users
    .find({ authID: { $in: followers }, deleted: false })
    .toArray();
  const followingList = await db.users
    .find({ authID: { $in: following }, deleted: false })
    .toArray();

  const total: followObject = {
    followers: followerList,
    following: followingList,
  };

  return total;
};

export default userAuthIdToConnections;
