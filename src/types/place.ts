import { ObjectID } from "mongodb";

export interface Place {
  _id: ObjectID;
  createdAt: Date;
  googlePlaceID: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  userAuthID: string;
  category: string;
  description: string;
  tags: string[];
  usersSaved: string[];
}
export interface RetrievedPlaceDetails {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface RootObject {
  result: Result;
}
export interface Result {
  formatted_address: string;
  geometry: Geometry;
  name: string;
}
export interface Geometry {
  location: Location;
}

export interface Location {
  lat: number;
  lng: number;
}
