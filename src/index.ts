import { startExpressServer } from "./apis/express";
import { startGraphQLServer } from "./apis/graphql";
import { startTRPCServer } from "./apis/trpc";

startExpressServer();
startGraphQLServer();
startTRPCServer();
