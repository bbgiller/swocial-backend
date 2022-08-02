import { Database } from "../../../lib/types";

const findUser = async (
  _root: undefined,
  { authID }: { authID: string },
  { db }: { db: Database }
) => {
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could Not Find User");
  }
  return user;
};

export default findUser;
