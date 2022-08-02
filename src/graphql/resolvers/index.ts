import merge from "lodash.merge";
// import { bookingResolvers } from "./Booking";
import { placeResolvers } from "./Place";
import { userResolvers } from "./User";
import { requestResolvers } from "./Request";

export const resolvers = merge(placeResolvers, userResolvers, requestResolvers);
