import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";

dotenv.config();
configurePassport();
const app = express();
const _dirname = path.resolve();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
// debug
store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //species whether to save the session on every request
    saveUninitialized: false, //specifies whether to save the uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 5,
      httpOnly: true, // prevents cross-site scripting attacks
    },
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

app.use(express.static(path.join(_dirname, "frontend/dist")));
app.use("*", (req, res) => {
  res.sendFile(path.join(_dirname, "frontend/dist", "index.html"));
});

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
