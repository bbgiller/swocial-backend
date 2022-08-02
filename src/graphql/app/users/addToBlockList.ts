import { Database, User } from "../../../lib/types";

const addToBlockList = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
): Promise<User> => {
  const { authID, blockedAuthID } = args;
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could Not Find User");
  }
  const blockedUser = await db.users.findOne({ authID: blockedAuthID });
  if (!blockedUser) {
    throw new Error("Could Not Find User");
  }

  if (user.blockedList.includes(blockedAuthID)) {
    throw new Error("You have already blocked this user");
  } else {
    if (user.following.includes(blockedAuthID)) {
      await db.users.updateOne(
        { authID },
        { $pull: { following: blockedAuthID } },
        function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Updated");
          }
        }
      );
    }

    if (user.followers.includes(blockedAuthID)) {
      await db.users.updateOne(
        { authID },
        { $pull: { followers: blockedAuthID } },
        function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Updated");
          }
        }
      );
    }

    if (blockedUser.following.includes(authID)) {
      await db.users.updateOne(
        { authID: blockedAuthID },
        { $pull: { following: authID } },
        function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Updated");
          }
        }
      );
    }

    if (blockedUser.followers.includes(authID)) {
      await db.users.updateOne(
        { authID: blockedAuthID },
        { $pull: { followers: authID } },
        function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Updated");
          }
        }
      );
    }

    await db.users.updateOne(
      { authID },
      { $push: { blockedList: blockedAuthID } },
      function (err) {
        if (err) {
          throw err;
        } else {
          console.log("Updated");
        }
      }
    );
  }
  return user;
};

export default addToBlockList;
