import { Database } from "../../../lib/types";
const findZipCode = async (
  _root: undefined,
  args: any,
  { db, req }: { db: Database; req: Request }
) => {
  const { authID } = args;
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("User can't be found");
  }
  if (!user.hometown) {
    return;
  }
  const zip = await db.zip_codes.findOne({ zip: user.hometown });
  if (!zip) {
    throw new Error("Could not locate relevant city");
  }
  return zip;
};

export default findZipCode;
