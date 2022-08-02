import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net`;

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("main");
  console.log("database has been connected");

  return {
    places: db.collection("test_places"),
    users: db.collection("users"),
    requests: db.collection("requests"),
    zip_codes: db.collection("zip_codes"),
  };
};
