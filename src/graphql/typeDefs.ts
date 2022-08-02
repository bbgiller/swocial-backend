import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Place {
    id: ID
    createdAt: String
    googlePlaceID: String
    userAuthID: String
    name: String
    address: String
    lat: Float
    lng: Float
    category: String
    description: String
    tags: [String]
    usersSaved: [String]
  }
  type User {
    id: ID!
    createdAt: String
    authID: String
    firstName: String
    lastName: String
    userName: String
    phoneNumber: String
    email: String
    hometown: String
    places: [String]
    savedPlaces: [String]
    outgoingFriendRequests: [String]
    incomingFriendRequests: [String]
    followers: [String]
    following: [String]
    newUser: Boolean
    profilePictureURL: String
    outgoingRequests: [ID]
    incompletedRequests: [ID]
    completedRequests: [ID]
    private: Boolean
    blockedList: [String]
    deleted: Boolean
  }

  type Request {
    id: ID!
    createdAt: String
    userRequesting: String
    userNameRequesting: String
    userRequested: String
    userNameRequested: String
    requestDescription: String
    complete: Boolean
  }

  type ZipCode {
    id: ID!
    zip: String
    lat: String
    lng: String
    city: String
    state_id: String
    state_name: String
  }

  type followObject {
    followers: [User]
    following: [User]
  }

  type Final {
    following: User
    places: Boolean
  }

  type placeMarkerObject {
    name: String
    category: String
    latitude: Float
    longitude: Float
    description: String
    tags: [String]
    googlePlaceID: String
    placeID: String
    address: String
  }
  type RetrievedPlaceDetails {
    name: String
    latitude: Float
    longitude: Float
    address: String
  }

  type placeMarkerAndUserObject {
    PlaceObject: Place
    RetrievedPlaceDetails: RetrievedPlaceDetails
  }

  type userDescription {
    user: User
    description: String
  }

  type isSavedAndUser {
    user: User
    isSaved: Boolean
  }

  type Query {
    #Places
    placeByID(id: ID!): Place!
    places: [Place!]

    #Users
    users(authID: String): [User!]
    userByAuthID(authID: String!): User!
    getUserPlaceIds(authID: String!): [String!]!
    loadUserPlaces(authID: String!, includeFollowing: Boolean!): [Place]
    loadFollowingPlaces(authID: String!): [placeMarkerAndUserObject!]!
    loadUserSavedPlaces(authID: String!): [placeMarkerAndUserObject]
    userAuthIdToConnections(authID: String!): followObject!
    userAuthIdToFollowRequests(authID: String!): [User!]!
    returnFollowingWhoHavePlace(
      authID: String!
      googlePlaceID: String!
    ): [userDescription]
    savedPlaceInUser(authID: String!, placeID: String!): Boolean!
    userConnectionRequests(authID: String!): [User]
    userExists(authID: String!): Boolean!
    renderUserBlockList(authID: String!): [User]
    findZipCode(authID: String): ZipCode

    #Requests
    requests: [Request!]
    requestByUserID(authID: String!): [Request]
    outgoingRequestsByUserID(authID: String!): [Request]
    incomingRequestsByUserID(authID: String!): [Request]
  }

  type Mutation {
    #Places
    addPlace(
      googlePlaceID: String
      userAuthID: String
      category: String
      description: String
      tags: [String]
      usersSaved: [String]
      lat: Float
      lng: Float
      name: String
      address: String
    ): Place!
    deletePlace(id: ID!): Place!
    # deleteUser(id: ID!): User!

    #Users
    addUser(
      authID: String
      firstName: String
      lastName: String
      userName: String
      email: String
      phoneNumber: String
      hometown: String
    ): User!
    patchUser(
      authID: String
      firstName: String
      lastName: String
      hometown: String
      userName: String
    ): User!
    addPlaceToUser(authID: String, placeID: String): User!
    addSavedPlaceToUser(authID: String, placeID: String): isSavedAndUser!
    addProfilePictureToUser(authID: String, profilePictureURL: String): User! #add authID
    patchNewUserStatus(authID: String!): User!
    sendFollowRequest(authID: String!, connectedAuthID: String!): User!
    acceptFollowRequest(
      authID: String!
      connectedAuthID: String!
      accepted: Boolean!
    ): User!
    togglePrivacy(authID: String): User!
    addToBlockList(authID: String!, blockedAuthID: String!): User!
    unBlockUser(authID: String!, blockedAuthID: String!): User!
    sendConnectionRequest(authID: String!, connectedAuthID: String!): User!
    declineConnectionRequest(authID: String!, connectedAuthID: String!): User!
    acceptConnectionRequest(authID: String!, connectedAuthID: String!): User!
    toggleNewUser(authID: String!): User
    deleteUser(authID: String!): User

    #Requests

    newRequest(
      userRequesting: String
      userRequested: String
      requestDescription: String
    ): Request!
  }
`;
