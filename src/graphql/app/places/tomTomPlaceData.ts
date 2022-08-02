import axios from "axios";
import { RootObject, Place } from "../../../types/place";
function getPlaceData(place: Place) {
  return axios
    .get<RootObject>(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.googlePlaceID}&fields=formatted_address,name,geometry/location&key=AIzaSyAGdhu8jyVI2VNIPl5JtZH-SqzffHyBsp4`
    )
    .then((place) => {
      const lat = place.data.result.geometry.location.lat;
      const lng = place.data.result.geometry.location.lng;
      const name = place.data.result.name;
      const address = place.data.result.formatted_address;

      interface retrievedPlaceDetails {
        name: string;
        latitude: number;
        longitude: number;
        address: string;
      }

      const newPlace: retrievedPlaceDetails = {
        name: name,
        latitude: lat,
        longitude: lng,
        address: address,
      };

      return newPlace;
    });
}

export default getPlaceData;
