import { RetrievedPlaceDetails } from "../../../types/place";
import getPlaceData from "./tomTomPlaceData";
import { Database, Place } from "../../../lib/types";

const loadFollowingPlaces = async (
  _root: undefined,
  args: any,
  { db }: { db: Database }
) => {
  const { authID } = args;
  const user = await db.users.findOne({
    authID,
  });
  if (!user) {
    throw new Error("User Could Not Be Found");
  }

  const following = user.following;

  const places = await db.places.find({
    userAuthID: { $in: following },
  });
  let placesArray = await places.toArray();
  placesArray = [...new Set(placesArray)];

  interface placeMarkerAndUserObject {
    PlaceObject: Place;
    RetrievedPlaceDetails: Promise<RetrievedPlaceDetails>;
  }

  const usersAndPlace = placesArray.map((place) => {
    const retrieved = getPlaceData(place);

    const returnPlaceData: placeMarkerAndUserObject = {
      PlaceObject: place,
      RetrievedPlaceDetails: retrieved,
    };

    return returnPlaceData;
  });

  return usersAndPlace;
};

export default loadFollowingPlaces;
