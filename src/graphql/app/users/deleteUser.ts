import { Database } from "../../../lib/types";
const deleteUser = async (
  _root: undefined,
  { authID }: { authID: string },
  { db, req }: { db: Database; req: Request }
) => {
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("User can't be found");
  }
  await db.users.findOneAndUpdate(user, { $set: { deleted: true } });
  await db.places.deleteMany({ userAuthID: authID });

  return user;
};

export default deleteUser;
