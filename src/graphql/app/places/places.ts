import { ObjectId } from "mongodb";
import { Database, User, Place } from "../../../lib/types";

export const returnFollowingWhoHavePlace = async (
  _root: undefined,
  { authID }: { authID: string },
  { db, req }: { db: Database; req: Request }
) => {
  const findUser = async (authID: string) => {
    const use = await db.users.findOne({
      authID,
    });
    if (use) {
      return use;
    } else {
      console.log(`find place:${authID}`);
      throw new Error("could not find user connection");
    }
  };
  console.log("hello");

  const user = await db.users.findOne({
    authID,
  });
  if (!user) {
    throw new Error("Could not find user");
  }

  if (!user.following) {
    throw new Error("User is not following anyone");
  }

  const checkPlace = async (placeID: string) => {
    const place = await db.places.findOne({
      _id: new ObjectId(placeID),
    });
    if (place) {
      return place.googlePlaceID;
    } else {
      console.log(`find place:${placeID}`);
      throw new Error("google place id could not be retrieved");
    }
  };

  const followingList = user.following.map((followID) => {
    return findUser(followID);
  });

  interface final {
    following: Promise<User>;
    places: Promise<Promise<string>[]>;
  }
  const fol = followingList.map((follow) => {
    const places = follow.then((fol) => {
      return fol.places.map((pl) => pl);
    });
    const goog = places.then((pl) => {
      return pl.map((id) => {
        return checkPlace(id);
      });
    });

    const check: final = {
      following: follow,
      places: goog,
    };
    return check;
  });

  return fol;

  //   const newFinal: final = {
  //     following: followingList,
  //     places: ["1"],
  //   };

  //   [[placeID], [placeID2]]
};
