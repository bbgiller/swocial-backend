import { Database, User } from "../../../lib/types";

const unBlockUser = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
): Promise<User> => {
  const { authID, blockedAuthID } = args;
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could Not Find User");
  }
  if (user.blockedList.includes(blockedAuthID)) {
    await db.users.updateOne(
      { authID },
      { $pull: { blockedList: blockedAuthID } },
      function (err) {
        if (err) {
          throw err;
        } else {
          console.log("Updated");
        }
      }
    );
  } else {
    throw new Error("User has already been unblocked");
  }
  return user;
};

export default unBlockUser;
