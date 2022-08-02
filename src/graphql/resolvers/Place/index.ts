import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Place } from "../../../lib/types";
export const placeResolvers: IResolvers = {
  Query: {
    places: async (_root: undefined, _args: {}, { db }: { db: Database }) => {
      console.log("here 123");
      return await db.places.find({}).toArray();
    },
    placeByID: async (
      _root: undefined,
      { id }: { id: string },
      { db, req }: { db: Database; req: Request }
    ): Promise<Place> => {
      try {
        const place = await db.places.findOne({
          _id: new ObjectId(id),
        });

        if (!place) {
          throw new Error("place can't be found");
        }

        return place;
      } catch (error) {
        throw new Error(`Failed to query place: ${error}`);
      }
    },
  },
  Mutation: {
    addPlace: async (_root: undefined, args, { db }: { db: Database }) => {
      const {
        userAuthID,
        googlePlaceID,
        description,
        category,
        tags,
        name,
        address,
        lat,
        lng,
      } = args;
      // const userPlaces = await db.places.find({ userAuthID }).toArray();
      // if (userPlaces.length > 20) {
      //   throw new Error(
      //     "Temporarily cannot add more than 4 places during maintenance. Sorry :("
      //   );
      // }
      const place: Place = {
        _id: new ObjectId(),
        createdAt: new Date(),
        googlePlaceID: googlePlaceID,
        userAuthID: userAuthID,
        description: description,
        category: category,
        tags: tags,
        usersSaved: [],
        name: name,
        address: address,
        lat: lat,
        lng: lng,
      };
      await db.places.insertOne(place);
      return place;
    },

    deletePlace: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ) => {
      const deleteRes = await db.places.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteRes.value) {
        throw new Error("failed to delete place");
      }

      return deleteRes.value;
    },
  },
  Place: {
    id: ({ _id }) => _id,
  },
};
