import { RetrievedPlaceDetails } from "../../../types/place";
import getPlaceData from "./tomTomPlaceData";
import { Database, Place } from "../../../lib/types";

// const loadUserPlaces = async (
//   _root: undefined,
//   args: any,
//   { db }: { db: Database }
// ) => {
//   const { authID, includeFollowing } = args;
//   const user = await db.users.findOne({
//     authID,
//   });
//   if (!user) {
//     throw new Error("User Could Not Be Found");
//   }

//   const following = user.following;
//   const userIDAndFollowing = includeFollowing
//     ? [user.authID].concat(following)
//     : [user.authID];

//   const places = await db.places.find({
//     userAuthID: { $in: userIDAndFollowing },
//   });
//   let placesArray = await places.toArray();
//   placesArray = [...new Set(placesArray)];

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

const loadUserPlaces = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
) => {
  const { authID, includeFollowing } = args;
  const user = await db.users.findOne({
    authID,
  });
  if (!user) {
    throw new Error("User Could Not Be Found");
  }

  const following = user.following;
  const userIDAndFollowing = includeFollowing
    ? [user.authID].concat(following)
    : [user.authID];

  const places = await db.places.find({
    userAuthID: { $in: userIDAndFollowing },
  });
  let placesArray = await places.toArray();
  placesArray = [...new Set(placesArray)];

  return placesArray;
};

export default loadUserPlaces;
