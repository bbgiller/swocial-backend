import { Database } from "../../../lib/types";
const toggleNewUser = async (
  _root: undefined,
  { authID }: { authID: string },
  { db, req }: { db: Database; req: Request }
) => {
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("User can't be found");
  }
  if (!user.newUser) {
    return;
  }

  await db.users.updateOne(user, {
    $set: { newUser: false },
  });

  return user;
};

export default toggleNewUser;
