import { Database, User } from "../../../lib/types";

const togglePrivacy = async (
  _root: undefined,
  { authID }: { authID: string },
  { db }: { db: Database }
): Promise<User> => {
  console.log(`Hit toggle privacy`);
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could not find user");
  }
  await db.users.updateOne(
    { authID },
    { $set: { private: !user?.private } },
    function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Updated");
      }
    }
  );
  return user;
};

export default togglePrivacy;
