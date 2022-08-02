require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";
import os from "os";

// const networkInterfaces = os.networkInterfaces();
// const arr = networkInterfaces["Local Area Connection 3"];
// const ip = arr[1].address || null;

async function mount(app: Application) {
  const db = await connectDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
    introspection: true,
    playground: true,
  });
  server.applyMiddleware({ app, path: "/" });

  const port = process.env.PORT || 9000;
  app.listen(port);

  console.log(`[app]: 192.168.1.183:${port}`);
}

mount(express());
