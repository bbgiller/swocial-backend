import { Database } from "../../../lib/types";
const addProfilePictureToUser = async (
  _root: undefined,
  args: any,
  { db, req }: { db: Database; req: Request }
) => {
  const user = await db.users.findOne({ authID: args.authID });
  if (!user) {
    throw new Error("User can't be found");
  }

  // user.currentLocation = "12";
  const updatedUser = await db.users.updateOne(user, {
    $set: { profilePictureURL: args.profilePictureURL },
  });

  return updatedUser;
};

export default addProfilePictureToUser;
