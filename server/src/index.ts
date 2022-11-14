import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dataSource from './utils';
require('dotenv').config()
import { ApolloServer } from "apollo-server";
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';


const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONT_DEV_URL }));


const start = async (): Promise<void> => {
  console.log("Connecting to database ...");
//
//   await dataSource.initialize();
//
//   const schema = await buildSchema({
//     // resolvers: [WilderResolver],
//   });
//
//   const server = new ApolloServer({
//     schema,
//     csrfPrevention: true,
//     cache: "bounded",
//     plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
//   });

  // await server.listen().then(({ url }) => {
  //   console.log(`🚀  Server is very ready at ${url}`);
  // });

  app.listen(5001, () => {
    console.log("listening on port 5001");
  });
};

void start();
