import { RetrievedPlaceDetails } from "../../../types/place";
import getPlaceData from "./tomTomPlaceData";
import { Database, Place } from "../../../lib/types";

const loadUserSavedPlaces = async (
  _root: undefined,
  { authID }: { authID: string },
  { db }: { db: Database }
) => {
  const user = await db.users.findOne({
    authID,
  });
  if (!user) {
    throw new Error("User Could Not Be Found");
  }

  const savedPlaces = db.places.find({
    usersSaved: { $elemMatch: { savedID: user.authID } },
  });
  const placesArray = await savedPlaces.toArray();

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

export default loadUserSavedPlaces;
