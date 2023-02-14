import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import allTypeDefs from './schemas/index.schema.js';
import allResolvers from './resolvers/index.resolver.js';

dotenv.config();

// “merging” types and resolvers
const server = new ApolloServer({
  //   typeDefs: [allTypeDefs],
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  introspection: true,
  playground: true,
});

const mongoDB = process.env.MONGODB_URL;

mongoose.set('strictQuery', true);
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB..');
    return startStandaloneServer(server, {
      listen: { port: process.env.PORT },
    });
  })
  .then((server) => {
    console.log(`🚀  Server ready at: ${server.url}`);
  });