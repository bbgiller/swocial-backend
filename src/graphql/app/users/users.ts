import { ObjectId } from "mongodb";
import { Database, User, Place } from "../../../lib/types";
import getPlaceData from "../places/tomTomPlaceData";
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
    console.log(user?.incomingFriendRequests.length);

    if (!user) {
      throw new Error("User can't be found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to query user: ${error}`);
  }
};

export const getUserPlaceIds = async (
  _root: undefined,
  { authID }: { authID: string },
  { db, req }: { db: Database; req: Request }
) => {
  try {
    const user = await db.users.findOne({
      authID,
    });

    if (!user) {
      throw new Error("User can't be found");
    }
    if (!user.places) {
      throw new Error("User does not have any saved places");
    }
    return user.places;
  } catch (error) {
    throw new Error(`Failed to query user: ${error}`);
  }
};

// export const userAuthIdToPlaces = async (
//   _root: undefined,
//   { authID }: { authID: string },
//   { db, req }: { db: Database; req: Request }
// ) => {
//   //takes in auth ID and finds corresponding user
//   const user = await db.users.findOne({
//     authID,
//   });
//   if (!user) {
//     throw new Error("Could not find user");
//   }
//   //Takes in Place.id and retrives corresponding google place id
//   const findPlace = async (placeID: string) => {
//     const place = await db.places.findOne({
//       _id: new ObjectId(placeID),
//     });
//     if (place) {
//       return place;
//     } else {
//       console.log(`find place:${placeID}`);
//       throw new Error("google place id could not be retrieved");
//     }
//   };

//   //sets places to the user's places array (place object ids)
//   const findConnectionPlace = async (authID: string) => {
//     const place = await db.places.find({
//       userAuthID: authID,
//     });

//     const placesArray = [] as string[];
//     if (place) {
//       place.forEach((pl) => placesArray.push(pl._id.toHexString()));
//     }
//     return placesArray;
//   };

//   const allFollowingPlaces = [] as string[];

//   user.following.forEach((followID) => {
//     findConnectionPlace(followID).then((pl) => {
//       console.log(followID);
//       allFollowingPlaces.concat(pl);
//     });
//   });
//   console.log(allFollowingPlaces);

//   const places = [...user.places].concat(allFollowingPlaces);
//   if (places) {
//     console.log("hit if places");
//     //maps through place object ids and replaces them with google place ids
//     const newPlaces = places.map((place) => {
//       return findPlace(place).then((newPlace) => newPlace);
//     });

//     //newplaces if array of google place ids
//     const loc = newPlaces.map((place) => {
//       return place.then((pl) => {
//         return getPlaceData(
//           pl.googlePlaceID,
//           pl.category,
//           pl.description,
//           pl.tags,
//           pl._id.toHexString()
//         ).then((plc) => plc);
//       });
//     });
//     return loc;
//   }
// };

// export const userAuthIdToSavedPlaces = async (
//   _root: undefined,
//   { authID }: { authID: string },
//   { db }: { db: Database }
// ) => {
//   const user = await db.users.findOne({
//     authID,
//   });
//   if (!user) {
//     throw new Error("User Could Not Be Found");
//   }

//   const savedPlaces = db.places.find({
//     usersSaved: { $elemMatch: { authID: user.authID } },
//   });
//   const placesArray = await savedPlaces.toArray();
//   console.log(placesArray);

//   interface placeMarkerAndUserObject {
//     PlaceObject: Place;
//     RetrievedPlaceDetails: Promise<RetrievedPlaceDetails>;
//   }

//   const usersAndPlace = placesArray.map((place) => {
//     const retrieved = getPlaceData(place);
//     const returnPlaceData: placeMarkerAndUserObject = {
//       PlaceObject: place,
//       RetrievedPlaceDetails: retrieved,
//     };
//     return returnPlaceData;
//   });
//   return usersAndPlace;
// };

// export const userAuthIdToSavedPlaces = async (
//   _root: undefined,
//   { authID }: { authID: string },
//   { db, req }: { db: Database; req: Request }
// ) => {
//   //takes in auth ID and finds corresponding user
//   const user = await db.users.findOne({
//     authID,
//   });
//   if (!user) {
//     throw new Error("Could not find user");
//   }
//   //Takes in Place.id and retrives corresponding google place id
//   const findPlace = async (placeID: string) => {
//     const place = await db.places.findOne({
//       _id: new ObjectId(placeID),
//     });
//     if (place) {
//       return place;
//     } else {
//       console.log(`find place:${placeID}`);
//       throw new Error("google place id could not be retrieved");
//     }
//   };

//   //sets places to the user's places array (place object ids)
//   const places = [...user.savedPlaces];
//   if (places) {
//     //maps through place object ids and replaces them with google place ids
//     const newPlaces = places.map((place) => {
//       return findPlace(place).then((newPlace) => newPlace);
//     });

//     //newplaces if array of google place ids
//     const loc = newPlaces.map((place) => {
//       return place.then((pl) => {
//         return getPlaceData(
//           pl.googlePlaceID,
//           pl.category,
//           pl.description,
//           pl.tags,
//           pl._id.toHexString()
//         ).then((plc) => plc);
//       });
//     });
//     return loc;
//   }
// };

// export const userAuthIdToConnections = async (
//   _root: undefined,
//   { authID }: { authID: string },
//   { db, req }: { db: Database; req: Request }
// ) => {
//   //takes in auth ID and finds corresponding user
//   const user = await db.users.findOne({
//     authID,
//   });
//   if (!user) {
//     throw new Error("Could not find user");
//   }

//   const followers = user.followers;
//   const following = user.following;

//   const findUser = async (authID: string) => {
//     const use = await db.users.findOne({
//       authID,
//     });
//     if (use) {
//       return use;
//     } else {
//       console.log(`find place:${authID}`);
//       throw new Error("could not find user connection");
//     }
//   };
//   const followerInfo = followers.map((authID) => {
//     return findUser(authID).then((use) => {
//       return use;
//     });
//   });
//   const followingInfo = following.map((authID) => {
//     return findUser(authID).then((use) => {
//       return use;
//     });
//   });

//   interface followObject {
//     followers: Promise<User>[];
//     following: Promise<User>[];
//   }

//   const total: followObject = {
//     followers: followerInfo,
//     following: followingInfo,
//   };

//   return total;

//   //Takes in Place.id and retrives corresponding google place id
//   // const findPlace = async (placeID: string) => {
//   //   const place = await db.places.findOne({
//   //     _id: new ObjectId(placeID),
//   //   });
//   //   if (place) {
//   //     category = place.category ? place.category : "";
//   //     return place.googlePlaceID;
//   //   } else {
//   //     console.log(`find place:${placeID}`);
//   //     throw new Error("google place id could not be retrieved");
//   //   }
//   // };

//   //sets places to the user's places array (place object ids)
//   // const places = [...user.places];
//   // if (places) {
//   //   //maps through place object ids and replaces them with google place ids
//   //   const newPlaces = places.map((place) => {
//   //     return findPlace(place).then((newPlace) => newPlace);
//   //   });

//   //   //newplaces if array of google place ids
//   //   const loc = newPlaces.map((place) => {
//   //     return place.then((pl) => {
//   //       return getPlaceData(pl, category).then((plc) => plc);
//   //     });
//   //   });
//   //   return loc;
//   // }
// };
export const userAuthIdToFollowRequests = async (
  _root: undefined,
  { authID }: { authID: string },
  { db, req }: { db: Database; req: Request }
) => {
  //takes in auth ID and finds corresponding user
  const user = await db.users.findOne({
    authID,
  });
  if (!user) {
    throw new Error("Could not find user");
  }

  const incomingFriendRequests = user.incomingFriendRequests;

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

  const incomingFriendRequestsInfo = incomingFriendRequests.map((authID) => {
    return findUser(authID).then((use) => {
      return use;
    });
  });

  return incomingFriendRequestsInfo;
};

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
      // console.log(use);
      return use;
    } else {
      // console.log(`find place:${authID}`);
      throw new Error("could not find user connection");
    }
  };
  // console.log("hello");

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
      return place.googlePlaceID === "ChIJ53I1Yn2AhYAR_Vl1vNygfMg";
    } else {
      // console.log(`find place:${placeID}`);
      throw new Error("google place id could not be retrieved");
    }
  };
  const followingList = user.following
    .concat(user._id.toHexString())
    .map((followID) => {
      // console.log(followID);
      return findUser(followID);
    });

  // return followingList;

  interface final {
    following: Promise<User>;
    places: Promise<boolean>;
  }
  const fol = followingList.map((follow) => {
    const places = follow.then((fol) => {
      return fol.places.map((pl) => {
        // console.log(pl);
        return pl;
      });
    });

    const goog = places.then((pl) => {
      const newPlaces = pl.every((id) => {
        return checkPlace(id).then((place) => {
          place === false;
        });
      });

      return newPlaces;
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
