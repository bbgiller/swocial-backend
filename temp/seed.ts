// require("dotenv").config();

import { ObjectID, ObjectId } from "mongodb";
import { connectDatabase } from "../src/database";
import { Place, User } from "../src/lib/types";

const seed = async () => {
  try {
    console.log(`[seed] : running...`);

    const db = await connectDatabase();
    const places: Place[] = [
      {
        _id: new ObjectId(),
        name: "Nara",
        address: "1515 Polk St",
        tags: ["restaurant", "food"],
      },
    ];
    const users: User[] = [
      {
        _id: new ObjectID(),
        fullName: "Josh Browder",
        phoneNumber: "+1-805-705-3478",
        currentLocation: "SB",
        email: "benjamingiller@gmail.co",
      },
    ];

    for (const place of places) {
      await db.places.insertOne(place);
    }
    for (const user of users) {
      await db.users.insertOne(user);
    }

    console.log(`[seed] : success`);
  } catch (error) {
    throw new Error("failed to seed database");
  }
};

seed();
