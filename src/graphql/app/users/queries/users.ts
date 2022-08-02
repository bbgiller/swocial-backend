import { Database, User } from "../../../../lib/types";
export const userByAuthID = async (
  _root: undefined,
  { authID }: { authID: string },
  { db, req }: { db: Database; req: Request }
) => {
  try {
    // console.log(`query userbyAuthID: ${authID}`);
    const user = await db.users.findOne({
      authID,
    });

    if (!user) {
      throw new Error("User can't be found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to query user: ${error}`);
  }
};
