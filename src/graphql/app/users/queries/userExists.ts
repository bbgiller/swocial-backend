import { Database } from "../../../../lib/types";

const userExists = async (
  _root: undefined,
  { authID }: { authID: string },
  { db }: { db: Database }
): Promise<boolean> => {
  const user = await db.users.findOne({ authID });
  if (!user) {
    return false;
  }
  return true;
};

export default userExists;
