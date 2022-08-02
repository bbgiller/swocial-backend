import { Database, User } from "../../../lib/types";
const renderUserBlockList = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
): Promise<User[]> => {
  console.log("render user block list");
  const { authID } = args;
  const user = await db.users.findOne({ authID });
  if (!user) {
    throw new Error("Could Not Find User");
  }
  const { blockedList } = user;
  if (user.blockedList.length == 0) {
    return [] as User[];
  }
  return await db.users.find({ authID: { $in: blockedList } }).toArray();
};

export default renderUserBlockList;
