import merge from "lodash.merge";
// import { bookingResolvers } from "./Booking";
import { userResolvers } from "./User";

export const resolvers = merge(userResolvers);
